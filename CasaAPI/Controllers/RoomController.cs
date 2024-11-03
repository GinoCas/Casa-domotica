using CasaAPI.Handlers.Room;
using CasaAPI.Models;
using CasaAPI.Utils.Responses;
using Microsoft.AspNetCore.Mvc;

namespace CasaAPI.Controllers
{
	[ApiController]
	public class RoomController : ControllerBase
	{
		private readonly GetHandler getHandler;
		public RoomController(GetHandler getHandler) 
		{
			this.getHandler = getHandler;
		}
		[HttpGet("/{roomName}")]
		public IActionResult GetRoomDevices(string roomName)
		{
			Response<RoomModel> response = getHandler.GetRoomByName(roomName);
			if (response.cdRes != "OK")
			{
				return NotFound(response.Json());
			}
			return Ok(response.Json());
		}
	}
}
