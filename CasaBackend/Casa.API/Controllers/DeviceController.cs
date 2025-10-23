using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Presenters.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
	[ApiController]
	[AllowAnonymous]
	public class DeviceController : ControllerBase
	{
        private readonly GetDeviceUseCase<DeviceEntity, DeviceViewModel> _getDeviceUseCase;
        private readonly UpdateDeviceUseCase<DeviceEntity, DeviceDto, DeviceViewModel> _updateDeviceUseCase;
		private readonly ILogger<DeviceController> _logger;
        private readonly IMQTTPublisher _mqttPublisher;

        public DeviceController(
            GetDeviceUseCase<DeviceEntity, DeviceViewModel> getDeviceUseCase,
            UpdateDeviceUseCase<DeviceEntity, DeviceDto, DeviceViewModel> updateDeviceUseCase,
            IMQTTPublisher mqttPublisher,
            ILogger<DeviceController> logger)
        {
            _getDeviceUseCase = getDeviceUseCase;
            _updateDeviceUseCase = updateDeviceUseCase;
            _mqttPublisher = mqttPublisher;
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
        [HttpGet("/device/date")]
        public async Task<IActionResult> GetDevicesModifiedAfter([FromQuery] DateTime dateUtc)
        {
            var result = await _getDeviceUseCase.ExecuteModifiedAfterAsync(dateUtc);
            return Ok(result.ToJson());
        }
        [HttpPatch("/device/{id}/update")]
        public async Task<IActionResult> UpdateDeviceById(int id, DeviceDto dto)
        {
            _logger.LogInformation("Obteniendo dispositivo con ID: {DeviceId}", id);
            var result = await _updateDeviceUseCase.ExecuteAsync(id, dto);
            return Ok(result.ToJson());
        }
        [HttpPut("/device/control")]
        public async Task<IActionResult> ControlDevice([FromBody] IEnumerable<ArduinoDeviceDto> dto)
        {
            await _mqttPublisher.PublishAsync("casa/devices/cmd", dto);
            return Ok(dto);
        }
	}
}
