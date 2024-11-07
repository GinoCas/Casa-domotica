using CasaAPI.Interfaces;

namespace CasaAPI.Models
{
    public class RoomModel
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<IDevice> Devices { get; set; }

		public RoomModel()
		{
			Name = "room_name";
			Devices = new List<IDevice>();
		}
	}
}
