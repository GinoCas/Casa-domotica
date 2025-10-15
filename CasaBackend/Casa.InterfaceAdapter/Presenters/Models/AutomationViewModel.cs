namespace CasaBackend.Casa.InterfaceAdapter.Presenters.Models
{
    public class AutomationViewModel
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public string StateText { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string InitTime { get; set; }
        public string EndTime { get; set; }
        public byte Days { get; set; }
        public ICollection<AutomationDeviceViewModel> Devices { get; set; }
    }
}