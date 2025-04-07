namespace CasaBackend.Casa.Core.Models
{
    public class Automation
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool State { get; set; }
        public TimeSpan InitTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public List<AutomationDevice> Devices { get; set; } = new List<AutomationDevice>();
    }
}
