using AutoMapper;
using Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Application.UseCases
{
    public class UpdateAutomationUseCase
    {
        private readonly IAutomationRepository<AutomationEntity> _repository;
        private readonly IMapper _mapper;

        public UpdateAutomationUseCase(IAutomationRepository<AutomationEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CoreResult<bool>> ExecuteAsync(int id, AutomationDto dto)
        {
            var entity = await _repository.GetByAutomationIdAsync(id);
            if (!entity.IsSuccess)
            {
                return CoreResult<bool>.Failure(entity.Errors);
            }
            _mapper.Map(dto, entity.Data);
            entity.Data.Devices.Clear();
            foreach (var deviceDto in dto.Devices)
            {
                entity.Data.Devices.Add(new AutomationDeviceEntity { DeviceId = deviceDto.Id, State = deviceDto.State, AutomationId = entity.Data.Id });
            }

            var result = await _repository.UpdateAutomationAsync(entity.Data);

            return result.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(result.Errors);
        }
    }
}