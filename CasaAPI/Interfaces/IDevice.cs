namespace CasaAPI.Interfaces
{
    public interface IDevice
    {
		public string deviceType { get; set; }
        public int id { get; set; }
        public int? pin { get; set; }
        public bool state { get; set; }
    }
}
