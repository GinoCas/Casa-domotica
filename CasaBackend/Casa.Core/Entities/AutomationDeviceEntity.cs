using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Core.Entities
{
    public class AutomationDeviceEntity
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public int AutomationId { get; set; }
        public int DeviceId { get; set; }
    }
}