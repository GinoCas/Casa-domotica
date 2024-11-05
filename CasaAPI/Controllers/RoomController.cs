using CasaAPI.Handlers.Room;
using CasaAPI.Models;
using CasaAPI.Utils.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaAPI.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class RoomController : ControllerBase
	{
		private readonly GetHandler getHandler;
		public RoomController(GetHandler getHandler) 
		{
			this.getHandler = getHandler;
		}
		[HttpGet("/room/{roomName}")]
		public IActionResult GetRoomByName(string roomName)
		{
			Response<RoomModel> response = getHandler.GetRoomByName(roomName);
			if (response.cdRes != "OK")
			{
				return NotFound(response.Json());
			}
			return Ok(response.Json());
		}
		[HttpGet("/rooms")]
		public IActionResult GetRoomListName()
		{
			Response<string> response = getHandler.GetRoomNameList();
			return Ok(response.Json());
		}
	}
}
