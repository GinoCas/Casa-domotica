namespace Casa.Core.Entities
{
    public class AutomationEntity
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public TimeSpan InitTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public ICollection<AutomationDeviceEntity> AutomationDevices { get; set; }
    }
}