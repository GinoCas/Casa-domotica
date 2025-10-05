using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using Microsoft.Extensions.Logging;
using System;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoDeviceMessageHandler : MQTTHandler<ArduinoMessageDto<ArduinoDeviceDto>>
    {
        private readonly IDeviceRepository<DeviceEntity> _deviceRepository;
        private readonly IFactory<DeviceEntity, ArduinoDeviceDto> _deviceFactory;
        private readonly IMapper _mapper;
        private readonly ILogger<ArduinoDeviceMessageHandler> _logger;

        public ArduinoDeviceMessageHandler(
            IDeviceRepository<DeviceEntity> deviceRepository,
            IFactory<DeviceEntity, ArduinoDeviceDto> deviceFactory,
            IMapper mapper, 
            ILogger<ArduinoDeviceMessageHandler> logger) 
            : base("casa/devices", logger)
        {
            _deviceRepository = deviceRepository;
            _deviceFactory = deviceFactory;
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
            var factoryResult = _deviceFactory.Fabric(dto);
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