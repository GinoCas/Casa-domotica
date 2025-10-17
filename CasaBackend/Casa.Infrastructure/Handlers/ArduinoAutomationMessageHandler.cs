using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoAutomationMessageHandler : MQTTHandler<ArduinoAutomationDto>
    {
        private readonly ILogger<ArduinoAutomationMessageHandler> _logger;
        private readonly IAutomationRepository<AutomationEntity> _repository;
        private readonly IMapper _mapper;
        public ArduinoAutomationMessageHandler(IAutomationRepository<AutomationEntity> repository, IMapper mapper, ILogger<ArduinoAutomationMessageHandler> logger)
            : base("casa/automations", logger)
        {
            _logger = logger;
            _mapper = mapper;
            _repository = repository;
        }
        protected override async Task ProcessMessageAsync(ArduinoAutomationDto dto) 
        {
            var result = await _repository.GetByAutomationIdAsync(dto.Id);
            if (result.IsSuccess)
            {
                _logger.LogInformation("La automatización existe, actualizando...");
                _mapper.Map(dto, result.Data);
                await _repository.UpdateAutomationAsync(result.Data);
                return;
            }
            _logger.LogInformation("La automatización con ID {autoId} no existe, creando nueva...", dto.Id);
            var entity = _mapper.Map<AutomationEntity>(dto);
            if (entity == null)
            {
                _logger.LogError("Error creando automatización {autoId}: {Errors}",
                    dto.Id, string.Join(", ", ["La automatización no se pudo mappear."]));
                return;
            }
            entity.Name = "Nueva Automatización";
            entity.Description = "Descripción";
            await _repository.CreateAutomationAsync(entity);
        }
    }
}