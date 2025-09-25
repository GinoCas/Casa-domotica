using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Presenters;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController(
		DoDeviceCommandUseCase<CommandDto> doDeviceCommandUseCase, 
		GetDeviceUseCase<DeviceEntity, DeviceViewModel> getDeviceUseCase,
		IValidator<DeviceDto> deviceValidator,
		IValidator<CommandDto> commandValidator,
		IArduinoService<ArduinoDeviceDto> arduinoService,
		ILogger<DeviceController> logger) : ControllerBase
	{
		private readonly DoDeviceCommandUseCase<CommandDto> _doDeviceCommandUseCase = doDeviceCommandUseCase;
        private readonly GetDeviceUseCase<DeviceEntity, DeviceViewModel> _getDeviceUseCase = getDeviceUseCase;
		private readonly IValidator<DeviceDto> _deviceValidator = deviceValidator;
		private readonly IValidator<CommandDto> _commandValidator = commandValidator;
		private readonly ILogger<DeviceController> _logger = logger;
		private readonly IArduinoService<ArduinoDeviceDto> _arduinoService = arduinoService;

		[HttpGet("/device/list")]
		public async Task<IActionResult> GetDeviceList()
		{
			var result = await _arduinoService.GetAllAsync();
			if (!result.IsSuccess)
			{
				return Ok("Dio error xd: " + result.Errors);
			}
			var devices = result.Data;
			foreach (var device in devices)
			{
				Console.WriteLine($"Device: ${device.Id}, Estado: {device.State}");
			}
			/*_logger.LogInformation("Obteniendo lista de dispositivos");
			var result = await _getDeviceUseCase.ExecuteAsync();
            _logger.LogInformation("Lista de dispositivos obtenida correctamente. Total: {Count}", result.Data.Count());
            return Ok(result.ToJson());*/
			return Ok("OK");
        }
		[HttpGet("/device/{id}")]
		public async Task<IActionResult> GetDeviceById(int id)
		{
            _logger.LogInformation("Obteniendo dispositivo con ID: {DeviceId}", id);
            var result = await _getDeviceUseCase.ExecuteAsync(id);
			if (!result.IsSuccess) 
			{
                _logger.LogWarning("Dispositivo {DeviceId} no encontrado: {Errors}", 
					id, string.Join(", ", result.Errors));
				return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Dispositivo {DeviceId} encontrado exitosamente", id);
            return Ok(result.ToJson());
		}
        [HttpPost("/device/execute")]
        public async Task<IActionResult> ExecuteDeviceCommand(CommandDto command)
        {
            _logger.LogInformation("Ejecutando comando {CommandName} para dispositivo {DeviceId}", 
				command.CommandName, command.DeviceId);
            var validationResult = await ValidateDtoAsync(_commandValidator, command);
			if (!validationResult.IsSuccess) 
			{
                _logger.LogWarning("Validación fallida para comando {CommandName}: {Errors}",
                        command.CommandName, string.Join(", ", validationResult.Errors));
                return BadRequest(validationResult.ToJson());
			};
			var result = await _doDeviceCommandUseCase.ExecuteAsync(command);
			if (!result.IsSuccess)
			{
                logger.LogWarning("Error ejecutando comando {CommandName}: {Errors}",
                        command.CommandName, string.Join(", ", result.Errors));
				return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Comando {CommandName} ejecutado exitosamente para dispositivo {DeviceId}",
                        command.CommandName, command.DeviceId);
            return Ok(result.ToJson());
        }
		private static async Task<CoreResult<DTO>> ValidateDtoAsync<DTO>(IValidator<DTO> validator, DTO dto)
		{
			var validationResult = await validator.ValidateAsync(dto);
			return validationResult.IsValid
				? CoreResult<DTO>.Success(dto)
				: CoreResult<DTO>.Failure(validationResult.Errors.Select(e => e.ErrorMessage).ToList());
		}
	}
}
