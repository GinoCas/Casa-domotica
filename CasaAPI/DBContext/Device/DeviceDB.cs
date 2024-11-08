using CasaAPI.DBContext.Room;
using CasaAPI.Handlers.Device;
using CasaAPI.Interfaces;
using CasaAPI.Models;

namespace CasaAPI.DBContext.Device
{
	public class DeviceDB
	{
		private readonly List<IDevice> list;
		public DeviceDB()
		{
			list = new List<IDevice>();
		}
		public void AddPlaceholders()
		{
			Add(new LedModel
			{ id = 0, pin = 1, state = true, amperes = 0, voltage = 0, brightness = 255 });
			Add(new LedModel
			{ id = 1, pin = 2, state = false, amperes = 0, voltage = 0, brightness = 255 });
			Add(new LedModel
			{ id = 2, pin = 3, state = false, amperes = 0, voltage = 0, brightness = 255 });
			Add(new FanModel
			{ id = 3, pin = 4, state = false, amperes = 0, voltage = 0, speed = 10 });
		}
		public List<IDevice> GetList()
		{
			return list;
		}
		public IDevice? GetById(int id)
		{
			if(id >= list.Count)
			{
				return null;
			}
			return list[id];
		}
		public string Add(IDevice device)
		{
			if (Exists(device.id))
			{
				return "Device already exists";
			}
			list.Add(device);
			return "OK";
		}
		public bool Exists(int id)
		{
			if (list.Any(device => device.id == id))
			{
				return true;
			}
			return false;
		}
	}
}
