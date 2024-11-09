using CasaAPI.Factories;
using CasaAPI.Handlers.Device;
using CasaAPI.Interfaces;
using CasaAPI.Utils.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CasaAPI.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController : ControllerBase
	{
		private readonly DeviceFactory deviceFactory;
		private readonly GetHandler getHandler;
		private readonly PostHandler postHandler;
		private readonly PutHandler putHandler;
		private readonly Arduino.ArduinoManager arduinoManager;
		public DeviceController(GetHandler getHandler, PostHandler postHandler, PutHandler putHandler,
			DeviceFactory deviceFactory, Arduino.ArduinoManager arduinoManager){
			this.getHandler = getHandler;
			this.postHandler = postHandler;
			this.putHandler = putHandler;
			this.deviceFactory = deviceFactory;
			this.arduinoManager = arduinoManager;
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
			Response<IDevice> response = new Response<IDevice>();
			request = JsonConvert.DeserializeObject<dynamic>(request.ToString());
			string deviceType;
			try
			{
				deviceType = request.deviceType;
			}
			catch
			{
				response.cdRes = "ERROR";
				response.dsRes = "Device format was invalid";
				response.errors.Add(response.dsRes);
				return BadRequest(response.Json());
			}
			if (deviceFactory.factory.TryGetValue(deviceType, out var createDevice))
			{
				IDevice device = createDevice(request);
				response = postHandler.CreateDevice(device);
				if(response.cdRes == "ERROR")
				{
					return BadRequest(response.Json());
				}
				return Ok(response.Json());
			}
			response.cdRes = "ERROR";
			response.dsRes = "Device Type not supported";
			response.errors.Add(response.dsRes);
			return BadRequest("Device Type not supported");
		}
		[HttpPut("/device/update")]
		public IActionResult UpdateDevice([FromBody] dynamic request)
		{
			Response<IDevice> response = new Response<IDevice>();
			request = JsonConvert.DeserializeObject<dynamic>(request.ToString());
			string deviceType;
			try
			{
				deviceType = request.deviceType;
			}
			catch
			{
				response.cdRes = "ERROR";
				response.dsRes = "Device format was invalid";
				response.errors.Add(response.dsRes);
				return BadRequest(response.Json());
			}
			if (deviceFactory.factory.TryGetValue(deviceType, out var createDevice))
			{
				IDevice device = createDevice(request);
				response = putHandler.UpdateDevice(device);
				if (response.cdRes == "ERROR")
				{
					return BadRequest(response.Json());
				}
				arduinoManager.UpdateDevice(device);
				return Ok(response.Json());
			}
			response.cdRes = "ERROR";
			response.dsRes = "Device Type not supported";
			response.errors.Add(response.dsRes);
			return BadRequest("Device Type not supported");
		}
	}
}
