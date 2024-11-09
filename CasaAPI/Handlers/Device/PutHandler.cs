using CasaAPI.DBContext.Device;
using CasaAPI.Interfaces;
using CasaAPI.Utils.Responses;

namespace CasaAPI.Handlers.Device
{
	public class PutHandler
	{
		private readonly DeviceDB dbContext;
		public PutHandler(DeviceDB dbContext)
		{
			this.dbContext = dbContext;
		}
		public Response<IDevice> UpdateDevice(IDevice device)
		{
			Response<IDevice> response = new Response<IDevice>();
			response.dsRes = dbContext.Update(device);
			if(response.dsRes != "OK")
			{
				response.cdRes = "ERROR";
				response.errors.Add(response.dsRes);
			}
			return response;
		}
	}
}
