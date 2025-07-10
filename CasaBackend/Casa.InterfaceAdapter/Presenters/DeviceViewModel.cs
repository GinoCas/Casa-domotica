namespace CasaBackend.Casa.InterfaceAdapter.Presenters
{
    public class DeviceViewModel
    {
        public int Id { get; set; }
        public string DeviceType { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool State { get; set; }
    }
}
