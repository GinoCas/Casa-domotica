using CasaBackend.Casa.Application.Interfaces.Registries;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Infrastructure.Registries
{
    public class CapabilityRegistry : ICapabilityRegistry
    {
        public Dictionary<DeviceType, List<Type>> Registry { get; } = new()
        {
            { DeviceType.Led, new List<Type> { typeof(DimmableEntity) } },
            { DeviceType.Fan, new List<Type> { typeof(VelocityEntity), typeof(DimmableEntity) } }
        };
    }
}