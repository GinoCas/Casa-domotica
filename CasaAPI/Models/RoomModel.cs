namespace CasaAPI.Models
{
	public class RoomModel
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<LedModel> Leds { get; set; }

		public RoomModel()
		{
			Name = "room_name";
			Leds = new List<LedModel>();
		}
	}
}
