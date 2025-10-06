using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;

using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.Infrastructure.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Models;
using Microsoft.Extensions.Logging;
using System;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoDeviceMessageHandler : MQTTHandler<ArduinoMessageDto<ArduinoDeviceDto>>
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

        protected override async Task ProcessMessageAsync(ArduinoMessageDto<ArduinoDeviceDto> message)
        {
            var dto = message.Data;
            var result = await _deviceRepository.GetByArduinoIdAsync(dto.ArduinoId);

            if (result.IsSuccess)
            {
                Console.WriteLine("El dispositivo existe, actualizando...");
                _mapper.Map(dto, result.Data);
                await _deviceRepository.UpdateDeviceAsync(result.Data);
                return;
            }
            _logger.LogInformation("El dispositivo {DeviceId} no existe, creando nuevo...", dto.ArduinoId);
            var entity = _mapper.Map<DeviceEntity>(dto);
            if (entity == null)
            {
                _logger.LogError("Error creando dispositivo {DeviceId}: {Errors}",
                    dto.ArduinoId, string.Join(", ", ["El dispositivo no se pudo mappear."]));
                return;
            }
            var capabilitiesResult = _capabilityFactory.Fabric(entity.DeviceType);
            if (!capabilitiesResult.IsSuccess)
            {
                _logger.LogError("Error creando capabilities para el tipo de dispositivo {DeviceType}: {Errors}",
                    entity.DeviceType, string.Join(", ", capabilitiesResult.Errors));
                return;
            }

            foreach (var capability in capabilitiesResult.Data)
            {
                entity.AddCapability(capability);
                _mapper.Map(dto, capability);
            }

            await _deviceRepository.AddDeviceAsync(entity);
        }
    }
}