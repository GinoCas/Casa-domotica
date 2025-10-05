using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;

namespace CasaBackend.Casa.Infrastructure.Factories
{
    public class CapabilityFactory(IMapper mapper) : IFactory<DeviceEntity, DeviceContextDto>
    {
        private readonly IMapper _mapper = mapper;

        private static DeviceEntity MapModelToEntity(DeviceModel model, DeviceEntity entity)
        {
            entity.Id = model.Id;
            entity.Name = model.Name;
            entity.Description = model.Description;
            entity.State = model.State;
            return entity;
        }
        public CoreResult<DeviceEntity> Fabric(DeviceContextDto dto)
        {
            var type = Enum.Parse<DeviceType>(dto.DeviceModel.DeviceType);
            switch (type)
            {
                case DeviceType.Led:
                    var dimm = dto.Capabilities.OfType<DimmableModel>().FirstOrDefault();
                    var led = new LedEntity(_mapper.Map<DimmableEntity>(dimm));
                    return CoreResult<DeviceEntity>.Success(_mapper.Map<DeviceEntity>(MapModelToEntity(dto.DeviceModel, led)));
                case DeviceType.Fan:
                    var vel = dto.Capabilities.OfType<VelocityModel>().FirstOrDefault();
                    var fan = new FanEntity(_mapper.Map<VelocityEntity>(vel));
                    return CoreResult<DeviceEntity>.Success(_mapper.Map<DeviceEntity>(MapModelToEntity(dto.DeviceModel, fan)));
                default:
                    return CoreResult<DeviceEntity>.Failure([$"Device type {dto.DeviceModel.DeviceType} not supported."]);
            }
        }
    }
}
