using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController : ControllerBase
	{
		[HttpGet("/device/list")]
		public IActionResult GetDeviceList()
		{
			return Ok();
		}
		[HttpGet("/device/{id}")]
		public IActionResult GetDeviceById(int id)
		{
			return Ok();
		}
		[HttpPost("/device/create")]
		public IActionResult CreateDevice([FromBody] dynamic request)
		{
			return Ok();
		}
		[HttpPut("/device/update")]
		public IActionResult UpdateDevice([FromBody] dynamic request)
		{
				
			return Ok();
		}
	}
}
