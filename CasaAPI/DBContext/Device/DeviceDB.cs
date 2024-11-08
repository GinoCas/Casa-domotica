using CasaAPI.Interfaces;

namespace CasaAPI.DBContext.Device
{
	public class DeviceDB
	{
		private readonly List<IDevice> list;
		public DeviceDB()
		{
			list = new List<IDevice>();
		}
		public List<IDevice> GetList()
		{
			Console.WriteLine(list.Count);
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
