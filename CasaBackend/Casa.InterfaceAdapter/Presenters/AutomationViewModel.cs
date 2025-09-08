namespace CasaBackend.Casa.InterfaceAdapter.Presenters
{
    public class AutomationViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool State { get; set; }
        public string InitTime { get; set; }
        public string EndTime { get; set; }
    }
}