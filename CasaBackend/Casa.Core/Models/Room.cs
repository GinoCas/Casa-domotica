namespace CasaBackend.Casa.Core.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Device> Devices { get; set; } = new List<Device>();
    }
}
