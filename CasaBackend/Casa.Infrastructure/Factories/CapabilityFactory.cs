using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.Models;

namespace CasaBackend.Casa.Infrastructure.Factories
{
    public class CapabilityFactory : IDeviceFactory<DeviceEntity, DeviceModel>
    {
        private readonly ICapabilityRepository<DimmableEntity> _dimmableRepo;
        private readonly ICapabilityRepository<VelocityEntity> _velocityRepo;
        private readonly IMapper _mapper;

        public CapabilityFactory(
            ICapabilityRepository<DimmableEntity> dimmableRepo,
            ICapabilityRepository<VelocityEntity> velocityRepo,
            IMapper mapper)
        {
            _dimmableRepo = dimmableRepo;
            _velocityRepo = velocityRepo;
            _mapper = mapper;
        }
        private static DeviceEntity MapModelToEntity(DeviceModel model, DeviceEntity entity)
        {
            entity.Id = model.Id;
            entity.Name = model.Name;
            entity.Description = model.Description;
            entity.State = model.State;
            return entity;
        }
        public async Task<DeviceEntity> FabricDeviceAsync(DeviceModel model)
        {
            var type = Enum.Parse<DeviceType>(model.DeviceType);
            switch (type)
            {
                case DeviceType.Led:
                    var dimm = await _dimmableRepo.GetByDeviceIdAsync(model.Id);
                    var led = new LedEntity(_mapper.Map<DimmableEntity>(dimm));
                    return _mapper.Map<DeviceEntity>(MapModelToEntity(model, led));
                case DeviceType.Fan:
                    var vel = await _velocityRepo.GetByDeviceIdAsync(model.Id);
                    var fan = new FanEntity(_mapper.Map<VelocityEntity>(vel));
                    return _mapper.Map<DeviceEntity>(MapModelToEntity(model, fan));
                default:
                    throw new NotSupportedException($"Device type {model.DeviceType} not supported.");
            }
        }
    }
}
