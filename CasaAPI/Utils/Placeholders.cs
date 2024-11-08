using CasaAPI.DBContext.Device;
using CasaAPI.DBContext.Room;
using CasaAPI.Handlers.Device;

namespace CasaAPI.Utils
{
	public class Placeholders
	{
		private readonly DeviceDB deviceDb;
		private readonly RoomDB roomDb;
		private readonly GetHandler deviceGetHandler;
		public Placeholders(DeviceDB deviceDb, RoomDB roomDb, GetHandler deviceGetHandler)
		{
			this.deviceDb = deviceDb;
			this.roomDb = roomDb;
			this.deviceGetHandler = deviceGetHandler;
			Make();
		}
		public void Make()
		{
			deviceDb.AddPlaceholders();
			roomDb.AddPlaceholders();
			var deviceList = deviceGetHandler.GetList().data;
			roomDb.AddDevice("living", deviceList[0]);
			roomDb.AddDevice("living", deviceList[1]);
			roomDb.AddDevice("kitchen", deviceList[2]);
			roomDb.AddDevice("kitchen", deviceList[3]);
		}
	}
}
