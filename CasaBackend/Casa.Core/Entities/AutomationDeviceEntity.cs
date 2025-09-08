using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.Core.Entities
{
    public class AutomationDeviceEntity
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public int AutomationId { get; set; }
        public AutomationEntity Automation { get; set; }
        public int DeviceId { get; set; }
        public DeviceEntity Device { get; set; }
    }
}