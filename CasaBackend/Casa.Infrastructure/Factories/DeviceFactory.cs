using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Factories
{
    public class DeviceFactory : IFactory<DeviceEntity, DeviceContextDto>
    {
        private readonly IMapper _mapper;

        public DeviceFactory(IMapper mapper)
        {
            _mapper = mapper;
        }

        public CoreResult<DeviceEntity> Fabric(DeviceContextDto input)
        {
            if (!Enum.TryParse<DeviceType>(input.DeviceModel.DeviceType, out var deviceType))
            {
                return CoreResult<DeviceEntity>.Failure([$"El tipo de dispositivo '{input.DeviceModel.DeviceType}' no es válido."]);
            }

            var entity = _mapper.Map<DeviceEntity>(input.DeviceModel);
            entity.DeviceType = deviceType;

            var capabilities = _mapper.Map<ICollection<ICapabilityEntity>>(input.Capabilities);
            foreach (var capability in capabilities)
            {
                entity.AddCapability(capability);
            }

            return CoreResult<DeviceEntity>.Success(entity);
        }
    }
}
