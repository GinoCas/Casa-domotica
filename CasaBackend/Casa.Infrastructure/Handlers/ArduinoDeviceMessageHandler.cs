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
        private readonly IDeviceFactory _deviceFactory;
        private readonly IFactory<IEnumerable<ICapabilityEntity>, DeviceType> _capabilityFactory;
        private readonly IMapper _mapper;
        private readonly ILogger<ArduinoDeviceMessageHandler> _logger;

        public ArduinoDeviceMessageHandler(
           IDeviceRepository<DeviceEntity> deviceRepository,
           IDeviceFactory deviceFactory,
           IFactory<IEnumerable<ICapabilityEntity>, DeviceType> capabilityFactory,
           IMapper mapper,
           ILogger<ArduinoDeviceMessageHandler> logger)
           : base("casa/devices", logger)
        {
            _deviceRepository = deviceRepository;
            _deviceFactory = deviceFactory;
            _capabilityFactory = capabilityFactory;
            _mapper = mapper;
            _logger = logger;
        }

        protected override async Task ProcessMessageAsync(ArduinoMessageDto<ArduinoDeviceDto> message)
        {
            var dto = message.Data;
            var result = await _deviceRepository.GetByDeviceIdAsync(dto.Id);
            Console.WriteLine($"Data:{result.Data}");

            if (result.IsSuccess)
            {
                Console.WriteLine("El dispositivo existe, actualizando...");
                var entity = result.Data;
                _mapper.Map(dto, entity);
                await _deviceRepository.UpdateDeviceAsync(entity);
                return;
            }
            _logger.LogInformation("El dispositivo {DeviceId} no existe, creando nuevo...", dto.Id);
            if (!Enum.TryParse<DeviceType>(dto.Type, out var deviceType))
            {
                _logger.LogError("Tipo de dispositivo desconocido: {Type}", dto.Type);
                return;
            }
            Console.WriteLine($"TIPO: {deviceType}");
            var capabilitiesResult = _capabilityFactory.Fabric(deviceType);
            if (!capabilitiesResult.IsSuccess)
            {
                _logger.LogError("Error creando capabilities para el tipo de dispositivo {DeviceType}: {Errors}",
                    deviceType, string.Join(", ", capabilitiesResult.Errors));
                return;
            }
            var baseCapabilities = capabilitiesResult.Data;
            var factoryResult = _deviceFactory.Fabric(dto, baseCapabilities);
            if (!factoryResult.IsSuccess)
            {
                _logger.LogError("Error creando dispositivo {DeviceId}: {Errors}",
                    dto.Id, string.Join(", ", factoryResult.Errors));
                return;
            }
            await _deviceRepository.AddDeviceAsync(factoryResult.Data);
        }
    }
}