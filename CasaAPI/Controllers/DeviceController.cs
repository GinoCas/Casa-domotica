using CasaAPI.Handlers.Device;
using CasaAPI.Interfaces;
using CasaAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CasaAPI.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController : ControllerBase
	{
		private readonly Dictionary<string, Func<dynamic, IDevice>> deviceFactory;
		private readonly GetHandler getHandler;
		private readonly PostHandler postHandler;
		public DeviceController(GetHandler getHandler, PostHandler postHandler)
		{
			this.getHandler = getHandler;
			this.postHandler = postHandler;
			deviceFactory = new Dictionary<string, Func<dynamic, IDevice>> // Fabrica de dispositivos
			{
				{ "Led", device => new LedModel
	{
					id = (int)device.baseProperties.id,
					state = (bool)device.baseProperties.state,
					voltage = (double)device.baseProperties.voltage,
					amperes = (double)device.baseProperties.amperes,
					brightness = (int)device.brightness,
	}
				},
				{ "Fan", device => new FanModel
					{
						id = (int)device.baseProperties.id,
						state = (bool)device.basePropertiesstate,
						voltage = (double)device.baseProperties.voltage,
						amperes = (double)device.baseProperties.amperes,
						speed = (int)device.speed,
					}
				}
			};
		}

		[HttpGet("/device/list")]
		public IActionResult GetDeviceList()
		{
			return Ok(getHandler.GetList().Json());
		}
		[HttpGet("/device/{id}")]
		public IActionResult GetDeviceById(int id)
		{
			return Ok(getHandler.GetById(id).Json());
		}
		[HttpPost("/device/create")]
		public IActionResult CreateDevice([FromBody] dynamic request)
		{
			request = JsonConvert.DeserializeObject<dynamic>(request.ToString());
			string deviceType;
			try
			{
				deviceType = request.deviceType;
			}
			catch
			{
				return BadRequest("Device format was invalid");
			}
			if(deviceFactory.TryGetValue(deviceType, out var createDevice))
			{
				IDevice device = createDevice(request);
				return Ok(postHandler.CreateDevice(device).Json());
			}
			return BadRequest("Device Type not supported");
		}
	}
}
