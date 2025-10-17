using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.Application.Interfaces.Services;

namespace CasaBackend.Casa.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class ModeController(IMQTTPublisher mqttPublisher, ILogger<ModeController> logger) : ControllerBase
    {
        private readonly IMQTTPublisher _mqttPublisher = mqttPublisher;
        private readonly ILogger<ModeController> _logger = logger;

        [HttpPut("/mode/control")]
        public async Task<IActionResult> ControlMode([FromBody] ArduinoModeDto dto)
        {
            _logger.LogInformation("Publishing mode control for {modeName}", dto.Name);
            await _mqttPublisher.PublishAsync("casa/modes/cmd", dto);
            return Ok(dto);
        }
    }
}