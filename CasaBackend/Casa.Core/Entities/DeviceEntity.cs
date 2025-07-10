using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Core.Entities
{
    public abstract class DeviceEntity
    {
        public int Id { get; set; }
        public abstract DeviceType DeviceType { get; }
        public bool State { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
