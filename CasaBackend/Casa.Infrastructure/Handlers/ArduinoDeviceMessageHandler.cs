using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoDeviceMessageHandler : MQTTHandler<ArduinoMessageDto<ArduinoDeviceDto>>
    {
        private readonly IDeviceRepository<DeviceEntity> _deviceRepository;
        private readonly IMapper _mapper;

        public ArduinoDeviceMessageHandler(
            IDeviceRepository<DeviceEntity> deviceRepository, 
            IMapper mapper, 
            ILogger<ArduinoDeviceMessageHandler> logger) 
            : base("casa/devices", logger)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
        }

        protected override async Task ProcessMessageAsync(ArduinoMessageDto<ArduinoDeviceDto> message)
        {
            var dto = message.Data;
            var result = await _deviceRepository.GetByDeviceIdAsync(dto.Id);

            if (result.IsSuccess)
            {
                Console.WriteLine("El dispositivo existe, actualizando...");
                var entity = result.Data;
                _mapper.Map(dto, entity);
                await _deviceRepository.UpdateDeviceAsync(entity);
            }
            else
            {
                Console.WriteLine("El dispositivo no existe.");
                Console.WriteLine("mapeando dto...");
                var newEntity = _mapper.Map<DeviceEntity>(dto);
                Console.WriteLine("DTO MAPEADO");
                await _deviceRepository.AddDeviceAsync(newEntity);
            }
        }
    }
}