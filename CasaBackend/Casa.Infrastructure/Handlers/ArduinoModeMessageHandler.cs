using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class ArduinoModeMessageHandler : MQTTHandler<ArduinoModeDto>
    {
        private readonly ILogger<ArduinoModeMessageHandler> _logger;
        private readonly IModeRepository<ModeEntity> _repository;
        private readonly IMapper _mapper;

        public ArduinoModeMessageHandler(IModeRepository<ModeEntity> repository, IMapper mapper, ILogger<ArduinoModeMessageHandler> logger)
            : base("casa/modes", logger)
        {
            _logger = logger;
            _mapper = mapper;
            _repository = repository;
        }

        protected override async Task ProcessMessageAsync(ArduinoModeDto dto)
        {
            var getResult = await _repository.GetByNameAsync(dto.Name);
            if (getResult.IsSuccess)
            {
                _logger.LogInformation("El modo {modeName} existe, actualizando...", dto.Name);
                var entity = getResult.Data;
                entity.State = dto.State;
                await _repository.UpdateModeAsync(entity);
                return;
            }

            _logger.LogInformation("El modo {modeName} no existe, creando nuevo...", dto.Name);
            var newEntity = _mapper.Map<ModeEntity>(dto);
            newEntity.Name = string.IsNullOrWhiteSpace(dto.Name) ? "Nuevo Modo" : dto.Name;
            await _repository.CreateModeAsync(newEntity);
        }
    }
}