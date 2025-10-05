using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Factories
{
    public class ArduinoDeviceFactory : IFactory<DeviceEntity, ArduinoDeviceDto>
    {
        public CoreResult<DeviceEntity> Fabric(ArduinoDeviceDto dto)
        {
            try
            {
                var deviceType = Enum.Parse<DeviceType>(dto.Type);
                
                return deviceType switch
                {
                    DeviceType.Led => CreateLedEntity(dto),
                    DeviceType.Fan => CreateFanEntity(dto),
                    _ => CoreResult<DeviceEntity>.Failure([$"Device type {dto.Type} not supported."])
                };
            }
            catch (ArgumentException)
            {
                return CoreResult<DeviceEntity>.Failure([$"Invalid device type: {dto.Type}"]);
            }
        }

        private CoreResult<DeviceEntity> CreateLedEntity(ArduinoDeviceDto dto)
        {
            var dimmableEntity = new DimmableEntity
            {
                Brightness = dto.Brightness.Value
            };

            var ledEntity = new LedEntity(dimmableEntity)
            {
                State = dto.IsOn
            };

            return CoreResult<DeviceEntity>.Success(ledEntity);
        }

        private CoreResult<DeviceEntity> CreateFanEntity(ArduinoDeviceDto dto)
        {
            var velocityEntity = new VelocityEntity
            {
                Speed = dto.Speed.Value
            };

            var fanEntity = new FanEntity(velocityEntity)
            {
                State = dto.IsOn
            };

            return CoreResult<DeviceEntity>.Success(fanEntity);
        }
    }
}