namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class AutomationDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool? State { get; set; }
        public TimeSpan? InitTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public ICollection<AutomationDeviceDto>? Devices { get; set; }
    }
}