using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Infrastructure.Registries
{
    public static class CapabilityRegistry
    {
        public static readonly Dictionary<DeviceType, List<Type>> Registry = new()
        {
            { DeviceType.Led, new List<Type> { typeof(DimmableEntity) } },
            { DeviceType.Fan, new List<Type> { typeof(VelocityEntity), typeof(DimmableEntity) } }
        };
    }
}