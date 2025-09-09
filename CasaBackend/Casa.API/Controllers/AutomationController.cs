    using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Presenters;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class AutomationController(
        GetAutomationUseCase<AutomationEntity, AutomationViewModel> getAutomationUseCase,
        GetAutomationUseCase<AutomationEntity, AutomationDetailViewModel> getAutomationDetailUseCase,
        CreateAutomationUseCase<AutomationEntity, AutomationDto> createAutomationUseCase,
        EditAutomationUseCase<AutomationEntity, AutomationDto> editAutomationUseCase,
        EraseAutomationUseCase<AutomationEntity> eraseAutomationUseCase,
        IValidator<AutomationDto> automationValidator,
        ILogger<AutomationController> logger) : ControllerBase
    {
        private readonly GetAutomationUseCase<AutomationEntity, AutomationViewModel> _getAutomationUseCase = getAutomationUseCase;
        private readonly GetAutomationUseCase<AutomationEntity, AutomationDetailViewModel> _getAutomationDetailUseCase = getAutomationDetailUseCase;
        private readonly CreateAutomationUseCase<AutomationEntity, AutomationDto> _createAutomationUseCase = createAutomationUseCase;
        private readonly EditAutomationUseCase<AutomationEntity, AutomationDto> _editAutomationUseCase = editAutomationUseCase;
        private readonly EraseAutomationUseCase<AutomationEntity> _deleteAutomationUseCase = eraseAutomationUseCase;
        private readonly IValidator<AutomationDto> _automationValidator = automationValidator;
        private readonly ILogger<AutomationController> _logger = logger;

        [HttpGet("/automation/list")]
        public async Task<IActionResult> GetAutomationList()
        {
            _logger.LogInformation("Getting automation list");
            var result = await _getAutomationUseCase.ExecuteAsync();
            _logger.LogInformation("Automation list retrieved successfully. Total: {Count}", result.Data.Count());
            return Ok(result.ToJson());
        }

        [HttpGet("/automation/{id}")]
        public async Task<IActionResult> GetAutomationById(int id)
        {
            _logger.LogInformation("Getting automation with ID: {AutomationId}", id);
            var result = await _getAutomationDetailUseCase.ExecuteAsync(id);
            if (!result.IsSuccess)
            {
                _logger.LogWarning("Automation {AutomationId} not found: {Errors}",
                    id, string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Automation {AutomationId} found successfully", id);
            return Ok(result.ToJson());
        }

        [HttpPost("/automation/create")]
        public async Task<IActionResult> CreateAutomation(AutomationDto automation)
        {
            _logger.LogInformation("Creating automation");
            var validationResult = await ValidateDtoAsync(_automationValidator, automation);
            if (!validationResult.IsSuccess)
            {
                _logger.LogWarning("Validation failed for automation: {Errors}",
                    string.Join(", ", validationResult.Errors));
                return BadRequest(validationResult.ToJson());
            }
            var result = await _createAutomationUseCase.ExecuteAsync(automation);
            if (!result.IsSuccess)
            {
                _logger.LogWarning("Error creating automation: {Errors}",
                    string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Automation created successfully with ID: {AutomationId}", result.Data);
            return Ok(result.ToJson());
        }

        [HttpPatch("/automation/edit/{id}")]
        public async Task<IActionResult> EditAutomation(int id, [FromBody] AutomationDto dto)
        {
            _logger.LogInformation("Editing automation with ID: {AutomationId}", id);

            var result = await _editAutomationUseCase.ExecuteAsync(id, dto);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Error editing automation: {Errors}",
                    string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }

            _logger.LogInformation("Automation edited successfully with ID: {AutomationId}", id);
            return Ok(result.ToJson());
        }

        [HttpPatch("/automation/{automationId}/device/{deviceId}/edit")]
        public async Task<IActionResult> EditAutomationDevice(int automationId, int deviceId, [FromBody] AutomationDeviceDto dto)
        {
            _logger.LogInformation("Edting automation device Id: {DeviceId} in automation {AutomationId}", deviceId, automationId);

            //var result = await _updateAutomationDeviceUseCase.ExecuteAsync(automationId, deviceId, dto);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Error updating device state in automation: {Errors}", string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }

            _logger.LogInformation("Successfully updated state for device {DeviceId} in automation {AutomationId}", deviceId, automationId);
            return Ok(result.ToJson());
        }

        [HttpDelete("/automation/erase/{id}")]
        public async Task<IActionResult> EraseAutomation(int id)
        {
            _logger.LogInformation("Erasing automation with ID: {AutomationId}", id);
            var result = await _deleteAutomationUseCase.ExecuteAsync(id);
            if (!result.IsSuccess)
            {
                _logger.LogWarning("Error erasing automation: {Errors}",
                    string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Automation erased successfully with ID: {AutomationId}", id);
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