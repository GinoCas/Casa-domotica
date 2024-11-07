using CasaAPI.DBContext.Device;
using CasaAPI.Interfaces;
using CasaAPI.Utils.Responses;

namespace CasaAPI.Handlers.Device
{
	public class PostHandler
	{
		private readonly DeviceDB dbContext;
		public PostHandler(DeviceDB dbContext)
		{
			this.dbContext = dbContext;
		}
		public Response<IDevice> CreateDevice(IDevice device)
		{
			dbContext.AddDevice(device);
			return new Response<IDevice>();
		}
	}
}
