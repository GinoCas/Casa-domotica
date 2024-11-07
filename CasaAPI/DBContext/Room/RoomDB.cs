using CasaAPI.Models;

namespace CasaAPI.DBContext.Room
{
	public class RoomDB
	{
		private readonly List<RoomModel> list;
		public RoomDB()
		{
			list = new List<RoomModel>();
			RoomModel placeholder = new RoomModel();
			RoomModel placeholder2 = new RoomModel();
			placeholder.Name = "Living";
			placeholder.Id = 1;
			placeholder2.Name = "Kitchen";
			placeholder2.Id = 2;
			list.Add(placeholder);
		}
		public RoomModel? GetByName(string name)
		{
			foreach (var room in list)
			{
				if(room.Name.ToLower() == name.ToLower()) return room;
			}
			return null;
		}
		public List<string> GetNameList()
		{
			List<string> namelist = new List<string>();
			foreach (var room in list)
			{
				namelist.Add(room.Name);
			}
			return namelist;
		}

	}
}
