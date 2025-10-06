using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Registries;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Infrastructure.Factories
{
    public class CapabilityFactory : IFactory<IEnumerable<ICapabilityEntity>, DeviceType>
    {
        private readonly ICapabilityRegistry _capabilityRegistry;

        public CapabilityFactory(ICapabilityRegistry capabilityRegistry)
        {
            _capabilityRegistry = capabilityRegistry;
        }

        public CoreResult<IEnumerable<ICapabilityEntity>> Fabric(DeviceType deviceType)
        {
            if (!_capabilityRegistry.Registry.TryGetValue(deviceType, out var capabilityTypes))
            {
                return CoreResult<IEnumerable<ICapabilityEntity>>.Success([]);
            }

            var capabilities = new List<ICapabilityEntity>();
            foreach (var capabilityType in capabilityTypes)
            {
                var capability = (ICapabilityEntity)Activator.CreateInstance(capabilityType)!;
                capabilities.Add(capability);
            }

            return CoreResult<IEnumerable<ICapabilityEntity>>.Success(capabilities);
        }
    }
}
