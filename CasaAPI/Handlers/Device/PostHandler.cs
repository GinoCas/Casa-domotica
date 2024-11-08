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
			Response<IDevice> response = new Response<IDevice>();
			try
			{
				dbContext.AddDevice(device);
			}
			catch
			{
				response.cdRes = "ERROR";
				response.dsRes = "Device couldn't be added - Check it's format";
				response.errors.Add(response.dsRes);
			}
			return response;
		}
	}
}
