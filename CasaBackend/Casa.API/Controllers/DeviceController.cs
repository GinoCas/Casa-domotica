using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController(IRepository<DeviceEntity> repository, ICommandService commandService, IMapper mapper) : ControllerBase
	{
		private readonly IRepository<DeviceEntity> _repository = repository;
		private readonly ICommandService _commandService = commandService;
		private readonly IMapper _mapper = mapper;

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
			var cmdEntity = _mapper.Map<CommandEntity>(command);
			var result = await _commandService.ExecuteAsync(cmdEntity);
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
