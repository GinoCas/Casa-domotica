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
			RoomModel placeholder2 = new RoomModel();
			placeholder.Name = "Living";
			placeholder.Id = 1;
			placeholder.Leds.Add(new LedModel(1, 1, false, 255, 0, 0));
			placeholder.Leds.Add(new LedModel(2, 15, true, 125, 0, 0));
			placeholder.Leds.Add(new LedModel(3, 7, false, 20, 0, 0));
			placeholder2.Name = "Kitchen";
			placeholder2.Id = 2;
			placeholder2.Leds.Add(new LedModel(3, 2, true, 50, 0, 0));
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
