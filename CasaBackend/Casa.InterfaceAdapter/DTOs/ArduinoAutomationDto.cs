namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class ArduinoAutomationDto
    {
        public int Id { get; set; }
        public int StartHour { get; set; }
        public int StartMinute { get; set; }
        public int EndHour { get; set; }
        public int EndMinute { get; set; }
        public byte Days { get; set; }
        public bool State { get; set; }
        public ICollection<AutomationDeviceDto> Devices { get; set; } = new List<AutomationDeviceDto>();
    }
}