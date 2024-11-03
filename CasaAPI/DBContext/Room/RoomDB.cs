using CasaAPI.Models;

namespace CasaAPI.DBContext.Room
{
	public class RoomDB
	{
		private readonly List<RoomModel> rooms;
		public RoomDB()
		{
			rooms = new List<RoomModel>();
		}
		public RoomModel? GetByName(string name)
		{
			foreach (var room in rooms)
			{
				if(room.Name == name) return room;
			}
			return null;
		} 

	}
}
