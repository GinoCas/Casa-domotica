using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Core.Interfaces.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController(IRepository<DeviceEntity> repository, ICommandService commandService) : ControllerBase
	{
		private readonly IRepository<DeviceEntity> _repository = repository;
		private readonly ICommandService _commandService = commandService;

        [HttpGet("/device/list")]
		public IActionResult GetDeviceList()
		{
			return Ok();
		}
		[HttpGet("/device/{id}")]
		public async Task<IActionResult> GetDeviceById(int id)
		{
			var result = await _repository.GetByIdAsync(id);
            return Ok(JsonConvert.SerializeObject(result));
		}
        [HttpPost("/device/execute")]
        public async Task<IActionResult> ExecuteDeviceCommand(CommandDto command)
        {
			var result = await _commandService.ExecuteAsync(command);
            return Ok(result);
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
