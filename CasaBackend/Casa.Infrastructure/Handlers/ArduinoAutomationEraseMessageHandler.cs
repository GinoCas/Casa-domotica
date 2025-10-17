using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoAutomationEraseMessageHandler : MQTTHandler<ArduinoAutomationEraseDto>
    {
        private readonly ILogger<ArduinoAutomationEraseMessageHandler> _logger;
        private readonly IAutomationRepository<AutomationEntity> _repository;

        public ArduinoAutomationEraseMessageHandler(IAutomationRepository<AutomationEntity> repository, ILogger<ArduinoAutomationEraseMessageHandler> logger)
            : base("casa/automations/erase", logger)
        {
            _logger = logger;
            _repository = repository;
        }

        protected override async Task ProcessMessageAsync(ArduinoAutomationEraseDto dto)
        {
            var result = await _repository.DeleteAutomationAsync(dto.Id);
            if (!result.IsSuccess)
            {
                _logger.LogWarning("Error borrando automatización {autoId}: {Errors}",
                    dto.Id, string.Join(", ", result.Errors));
                return;
            }
            _logger.LogInformation("Automatización {autoId} borrada correctamente.", dto.Id);
        }
    }
}