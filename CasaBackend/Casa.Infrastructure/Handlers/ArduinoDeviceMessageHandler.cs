using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoDeviceMessageHandler : MQTTHandler<IEnumerable<ArduinoDeviceDto>>
    {
        private readonly IDeviceRepository<DeviceEntity> _deviceRepository;
        private readonly IFactory<IEnumerable<ICapabilityEntity>, DeviceType> _capabilityFactory;
        private readonly IMapper _mapper;
        private readonly ILogger<ArduinoDeviceMessageHandler> _logger;

        public ArduinoDeviceMessageHandler(
           IDeviceRepository<DeviceEntity> deviceRepository,
           IFactory<IEnumerable<ICapabilityEntity>, DeviceType> capabilityFactory,
           IMapper mapper,
           ILogger<ArduinoDeviceMessageHandler> logger)
           : base("casa/devices", logger)
        {
            _deviceRepository = deviceRepository;
            _capabilityFactory = capabilityFactory;
            _mapper = mapper;
            _logger = logger;
        }

        protected override async Task ProcessMessageAsync(IEnumerable<ArduinoDeviceDto> dto)
        {
            if (dto == null || !dto.Any())
            {
                _logger.LogWarning("Lista de dispositivos vacía recibida por MQTT.");
                return;
            }
            var ids = dto.Select(d => d.Id).Distinct().ToList();
            var existingResult = await _deviceRepository.GetByDeviceIdsAsync(ids);
            if(!existingResult.IsSuccess)
            {
                _logger.LogWarning("Error consiguiendo lista de dispositivos existentes en la base de datos.");
                return;
            }
            var existingById = existingResult.Data.ToDictionary(d => d.Id);
            var entitiesToUpsert = new List<DeviceEntity>();
            foreach (var device in dto)
            {
                if (existingById.TryGetValue(device.Id, out var existingEntity))
                {
                    _mapper.Map(device, existingEntity);
                    entitiesToUpsert.Add(existingEntity);
                    continue;
                }

                _logger.LogInformation("El dispositivo {DeviceId} no existe, creando nuevo...", device.Id);
                var newEntity = _mapper.Map<DeviceEntity>(device);
                if (newEntity == null)
                {
                    _logger.LogError("Error creando dispositivo {DeviceId}: El dispositivo no se pudo mapear.", device.Id);
                    continue;
                }

                var capabilitiesResult = _capabilityFactory.Fabric(newEntity.DeviceType);
                if (!capabilitiesResult.IsSuccess)
                {
                    _logger.LogError("Error creando capabilities para el tipo de dispositivo {DeviceType}: {Errors}",
                        newEntity.DeviceType, string.Join(", ", capabilitiesResult.Errors));
                    continue;
                }

                foreach (var capability in capabilitiesResult.Data)
                {
                    newEntity.AddCapability(capability);
                    _mapper.Map(device, capability);
                }

                entitiesToUpsert.Add(newEntity);
            }

            if (entitiesToUpsert.Count == 0) return;
            var upsertResult = await _deviceRepository.UpsertDevicesAsync(entitiesToUpsert);
            if (!upsertResult.IsSuccess)
            {
                _logger.LogError("Error en upsert de dispositivos: {Errors}", string.Join(", ", upsertResult.Errors));
            }
        }
    }
}