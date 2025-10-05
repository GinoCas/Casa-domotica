using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using System.Collections.Generic;
using System.Linq;

namespace CasaBackend.Casa.Core.Entities
{
    public class DeviceEntity
    {
        public int Id { get; set; }
        public DeviceType DeviceType { get; set; }
        public bool State { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<ICapabilityEntity> Capabilities { get; set; } = [];

        public void AddCapability(ICapabilityEntity capability)
        {
            capability.Device = this;
            Capabilities.Add(capability);
        }

        public T? GetCapability<T>() where T : class, ICapabilityEntity
        {
            return Capabilities.OfType<T>().FirstOrDefault();
        }
    }
}
