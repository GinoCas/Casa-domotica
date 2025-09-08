namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class AutomationDto
    {
        public bool State { get; set; }
        public TimeSpan InitTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public ICollection<int> DeviceIds { get; set; }
    }
}