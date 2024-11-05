using CasaAPI.Models;

namespace CasaAPI.DBContext.Room
{
	public class RoomDB
	{
		private readonly List<RoomModel> rooms;
		public RoomDB()
		{
			rooms = new List<RoomModel>();
			RoomModel placeholder = new RoomModel();
			LedModel led = new LedModel(1, 1, false, 255, 0, 0);
			placeholder.Name = "Living";
			placeholder.Id = 1;
			placeholder.Leds.Add(led);
			rooms.Add(placeholder);
		}
		public RoomModel? GetByName(string name)
		{
			foreach (var room in rooms)
			{
				if(room.Name.ToLower() == name.ToLower()) return room;
			}
			return null;
		}
		public List<string> GetNameList()
		{
			List<string> list = new List<string>();
			foreach (var room in rooms)
			{
				list.Add(room.Name);
			}
			return list;
		}

	}
}
