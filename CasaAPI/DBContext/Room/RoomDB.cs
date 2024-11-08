using CasaAPI.DBContext.Device;
using CasaAPI.Interfaces;
using CasaAPI.Models;

namespace CasaAPI.DBContext.Room
{
	public class RoomDB
	{
		private readonly List<RoomModel> list;
		public RoomDB(DeviceDB deviceDbContext)
		{
			list = new List<RoomModel>();
		}
		public void AddPlaceholders()
		{
			RoomModel placeholder = new RoomModel();
			RoomModel placeholder2 = new RoomModel();
			placeholder.Name = "Living";
			placeholder.Id = 1;
			placeholder2.Name = "Kitchen";
			placeholder2.Id = 2;
			Add(placeholder);
			Add(placeholder2);
		}
		public string AddDevice(string roomName, IDeviceDto device)
		{
			RoomModel room = GetByName(roomName);
			room.Devices.Add(device);
			return "OK";
		}
		public string Add(RoomModel room)
		{
			list.Add(room);
			return "OK";
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
