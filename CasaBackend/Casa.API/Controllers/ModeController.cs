using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class ModeController(IMQTTPublisher mqttPublisher, IModeRepository<ModeEntity> repository, ILogger<ModeController> logger) : ControllerBase
    {
        private readonly IMQTTPublisher _mqttPublisher = mqttPublisher;
        private readonly IModeRepository<ModeEntity> _repository = repository;
        private readonly ILogger<ModeController> _logger = logger;

        [HttpPut("/mode/control")]
        public async Task<IActionResult> ControlMode([FromBody] ArduinoModeDto dto)
        {
            _logger.LogInformation("Publishing mode control for {modeName}", dto.Name);
            await _mqttPublisher.PublishAsync("casa/modes/cmd", dto);
            return Ok(dto);
        }

        [HttpGet("/mode/list")]
        public async Task<IActionResult> GetModes()
        {
            _logger.LogInformation("Fetching modes list");
            var result = await _repository.GetAllModesAsync();
            return Ok(result.ToJson());
        }
    }
}