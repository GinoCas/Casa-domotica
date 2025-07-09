using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController(DoDeviceCommandUseCase<CommandDto> doDeviceCommandUseCase, IMapper mapper) : ControllerBase
	{
		private readonly DoDeviceCommandUseCase<CommandDto> _doDeviceCommandUseCase = doDeviceCommandUseCase;

        [HttpGet("/device/list")]
		public IActionResult GetDeviceList()
		{
			return Ok();
		}
		[HttpGet("/device/{id}")]
		public async Task<IActionResult> GetDeviceById(int id)
		{
			//var result = await _repository.GetByIdAsync(id);
			return Ok();//JsonConvert.SerializeObject(result));
		}
        [HttpPost("/device/execute")]
        public async Task<IActionResult> ExecuteDeviceCommand(CommandDto command)
        {
			var response = new ApiResponse<bool>();
			try
			{
				response.Data = [await _doDeviceCommandUseCase.ExecuteAsync(command)];
				response.Success = true;
				response.Message = "OK";
			}
			catch(Exception ex)
			{
				response.Success = false;
				response.Message = "ERROR:" + ex.Message;
			}
            return Ok(response.ToJson());
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
