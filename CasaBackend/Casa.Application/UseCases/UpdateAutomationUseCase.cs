using AutoMapper;
using Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Presenters;

namespace CasaBackend.Casa.Application.UseCases
{
    public class UpdateAutomationUseCase(
        IAutomationRepository<AutomationEntity> repository, 
        IMapper mapper, IPresenter<AutomationEntity, 
            AutomationViewModel> presenter
        )
    {
        private readonly IAutomationRepository<AutomationEntity> _repository = repository;
        private readonly IPresenter<AutomationEntity, AutomationViewModel> _presenter = presenter;
        private readonly IMapper _mapper = mapper;

        public async Task<CoreResult<AutomationViewModel>> ExecuteAsync(int id, AutomationDto dto)
        {
            var entity = await _repository.GetByAutomationIdAsync(id);
            if (!entity.IsSuccess)
            {
                return CoreResult<AutomationViewModel>.Failure(entity.Errors);
            }
            _mapper.Map(dto, entity.Data);
            entity.Data.Devices.Clear();
            foreach (var deviceDto in dto.Devices)
            {
                entity.Data.Devices.Add(new AutomationDeviceEntity { DeviceId = deviceDto.Id, State = deviceDto.State, AutomationId = entity.Data.Id });
            }

            var result = await _repository.UpdateAutomationAsync(entity.Data);

            return result.IsSuccess 
                ? CoreResult<AutomationViewModel>.Success(_presenter.Present(result.Data))
                : CoreResult<AutomationViewModel>.Failure(result.Errors);
        }
    }
}