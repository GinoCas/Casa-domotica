using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.Models;

namespace CasaBackend.Casa.Infrastructure.Factories
{
    public class CapabilityFactory
    {
        private readonly ICapabilityRepository<DimmableEntity> _dimmableRepo;
        private readonly IMapper _mapper;

        public CapabilityFactory(ICapabilityRepository<DimmableEntity> dimmableRepo, IMapper mapper)
        {
            _dimmableRepo = dimmableRepo;
            _mapper = mapper;
        }

        public async Task<DeviceEntity> CreateAsync(DeviceModel model)
        {
            var type = Enum.Parse<DeviceType>(model.DeviceType);
            switch (type)
            {
                case DeviceType.Led:
                    var dimm = await _dimmableRepo.GetByDeviceIdAsync(model.Id);
                    var device = new LedEntity(_mapper.Map<DimmableEntity>(dimm));
                    return _mapper.Map<DeviceEntity>(device);
                default:
                    throw new NotSupportedException($"Device type {model.DeviceType} not supported.");
            }
        }
    }
}
