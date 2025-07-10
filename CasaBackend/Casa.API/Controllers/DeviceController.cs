using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Presenters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController(
		DoDeviceCommandUseCase<CommandDto> doDeviceCommandUseCase, 
		GetDeviceUseCase<DeviceEntity, DeviceViewModel> getDeviceUseCase) : ControllerBase
	{
		private readonly DoDeviceCommandUseCase<CommandDto> _doDeviceCommandUseCase = doDeviceCommandUseCase;
        private readonly GetDeviceUseCase<DeviceEntity, DeviceViewModel> _getDeviceUseCase = getDeviceUseCase;

        [HttpGet("/device/list")]
		public async Task<IActionResult> GetDeviceList()
		{
            var response = new ApiResponse<DeviceViewModel>();
            try
            {
                response.Data = await _getDeviceUseCase.ExecuteAsync();
                response.Success = true;
                response.Message = "OK";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "ERROR:" + ex.Message;
            }
            return Ok(response.ToJson());
        }
		[HttpGet("/device/{id}")]
		public async Task<IActionResult> GetDeviceById(int id)
		{
            var response = new ApiResponse<DeviceViewModel>();
            try
            {
                response.Data = [await _getDeviceUseCase.ExecuteAsync(id)];
                response.Success = true;
                response.Message = "OK";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "ERROR:" + ex.Message;
            }
            return Ok(response.ToJson());
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
