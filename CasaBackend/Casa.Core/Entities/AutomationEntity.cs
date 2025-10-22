namespace CasaBackend.Casa.Core.Entities
{
    public class AutomationEntity
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty ;
        public TimeSpan InitTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public byte Days { get; set; }
        public DateTime LastModified { get; set; }
        public ICollection<AutomationDeviceEntity> Devices { get; set; } = new List<AutomationDeviceEntity>();
    }
}