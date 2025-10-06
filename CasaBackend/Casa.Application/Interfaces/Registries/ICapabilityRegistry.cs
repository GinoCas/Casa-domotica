using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Application.Interfaces.Registries
{
    public interface ICapabilityRegistry
    {
        Dictionary<DeviceType, List<Type>> Registry { get; }
    }
}