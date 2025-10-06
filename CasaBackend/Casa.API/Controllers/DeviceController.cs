using CasaBackend.Casa.Application.Interfaces.Handlers;
using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Infrastructure.Handlers;
using CasaBackend.Casa.Infrastructure.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Presenters.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController : ControllerBase
	{
		private readonly DoDeviceCommandUseCase<CommandDto> _doDeviceCommandUseCase;
        private readonly GetDeviceUseCase<DeviceEntity, DeviceViewModel> _getDeviceUseCase;
        private readonly UpdateDeviceUseCase<DeviceEntity, DeviceDto, DeviceViewModel> _updateDeviceUseCase;
		private readonly IValidator<CommandDto> _commandValidator;
		private readonly ILogger<DeviceController> _logger;

        public DeviceController(
            DoDeviceCommandUseCase<CommandDto> doDeviceCommandUseCase,
            GetDeviceUseCase<DeviceEntity, DeviceViewModel> getDeviceUseCase,
            UpdateDeviceUseCase<DeviceEntity, DeviceDto, DeviceViewModel> updateDeviceUseCase,
            IValidator<CommandDto> commandValidator,
            ILogger<DeviceController> logger)
        {
            _doDeviceCommandUseCase = doDeviceCommandUseCase;
            _getDeviceUseCase = getDeviceUseCase;
            _updateDeviceUseCase = updateDeviceUseCase;
            _commandValidator = commandValidator;
            _logger = logger;
        }

        [HttpGet("/device/list")]
		public async Task<IActionResult> GetDeviceList()
		{
            _logger.LogInformation("Obteniendo lista de dispositivos");
			var result = await _getDeviceUseCase.ExecuteAsync();
            _logger.LogInformation("Lista de dispositivos obtenida correctamente. Total: {Count}", result.Data.Count());
            return Ok(result.ToJson());
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
        [HttpPost("/device/{id}/update")]
        public async Task<IActionResult> UpdateDeviceById(int id, DeviceDto dto)
        {
            _logger.LogInformation("Obteniendo dispositivo con ID: {DeviceId}", id);
            var result = await _updateDeviceUseCase.ExecuteAsync(id, dto);
            return Ok(result.ToJson());
        }
        [HttpPost("/device/execute")]
        public async Task<IActionResult> ExecuteDeviceCommand(CommandDto command)
        {
            _logger.LogInformation("Ejecutando comando {CommandName} para dispositivo {DeviceId}", 
				command.CommandName, command.DeviceId);
			var result = await _doDeviceCommandUseCase.ExecuteAsync(command);
			if (!result.IsSuccess)
			{
                _logger.LogWarning("Error ejecutando comando {CommandName}: {Errors}",
                        command.CommandName, string.Join(", ", result.Errors));
				return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Comando {CommandName} ejecutado exitosamente para dispositivo {DeviceId}",
                        command.CommandName, command.DeviceId);
            return Ok(result.ToJson());
        }
	}
}
