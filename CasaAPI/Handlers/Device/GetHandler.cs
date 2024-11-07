using CasaAPI.DBContext.Device;
using CasaAPI.Interfaces;
using CasaAPI.Utils.Responses;

namespace CasaAPI.Handlers.Device
{
	public class GetHandler
	{
		private readonly DeviceDB dbContext;
		public GetHandler(DeviceDB dbContext)
		{
			this.dbContext = dbContext;
		}
		public Response<IDevice> GetById(int id)
		{
			Response<IDevice> response = new Response<IDevice>();
			IDevice? device = dbContext.GetById(id);
			if(device == null)
			{
				response.cdRes = "ERROR";
				response.dsRes = "El dispositivo es inexistente";
				response.errors.Add(response.dsRes);
				return response;
			}
			response.data.Add(device);
			return response;
		}
		public Response<IDevice> GetList()
		{
			Response<IDevice> response = new Response<IDevice>();
			response.data = dbContext.GetList();
			return response;
		}
	}
}
