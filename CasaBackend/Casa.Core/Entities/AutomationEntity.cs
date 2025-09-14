namespace CasaBackend.Casa.Core.Entities
{
    public class AutomationEntity
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TimeSpan InitTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public ICollection<AutomationDeviceEntity> Devices { get; set; } = new List<AutomationDeviceEntity>();
    }
}