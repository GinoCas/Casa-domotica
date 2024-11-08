using CasaAPI.DBContext.Device;
using CasaAPI.Factories;
using CasaAPI.Interfaces;
using CasaAPI.Utils.Responses;

namespace CasaAPI.Handlers.Device
{
	public class GetHandler
	{
		private readonly DeviceDB dbContext;
		private readonly DeviceDtoFactory dtoFactory;
		public GetHandler(DeviceDB dbContext, DeviceDtoFactory dtoFactory)
		{
			this.dbContext = dbContext;
			this.dtoFactory = dtoFactory;
		}
		public Response<IDeviceDto> GetById(int id)
		{
			Response<IDeviceDto> response = new Response<IDeviceDto>();
			IDevice? device = dbContext.GetById(id);
			if(device == null)
			{
				response.cdRes = "ERROR";
				response.dsRes = "Device doesn't exist";
				response.errors.Add(response.dsRes);
				return response;
			}
			if (dtoFactory.factory.TryGetValue(device.deviceType, out var createDto))
			{
				var dto = createDto(device);
				response.data.Add(dto);
				return response;
			}
			response.cdRes = "ERROR";
			response.dsRes = "Device type not supported";
			return response;
		}
		public Response<IDeviceDto> GetList()
		{
			Response<IDeviceDto> response = new Response<IDeviceDto>();
			foreach (var device in dbContext.GetList())
			{
				if (dtoFactory.factory.TryGetValue(device.deviceType, out var createDto))
				{
					var dto = createDto(device);
					response.data.Add(dto);
				}
				else
				{
					response.errors.Add($"Device type: {device.deviceType} isn't supported");
				}
			}
			return response;
		}
	}
}
