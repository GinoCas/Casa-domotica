using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace CasaBackend.Casa.Application.UseCases
{
    public class EditAutomationDeviceUseCase<TDTO>
        where TDTO : class
    {
        private readonly IAutomationRepository<AutomationEntity> _repository;
        private readonly IMapper _mapper;

        public EditAutomationDeviceUseCase(IAutomationRepository<AutomationEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CoreResult<bool>> ExecuteAsync(int automationId, int deviceId, TDTO dto)
        {
            var entity = await _repository.GetByAutomationIdAsync(automationId);
            if (!entity.IsSuccess)
            {
                return CoreResult<bool>.Failure(entity.Errors);
            }
            var device = entity.Data.Devices.FirstOrDefault(d => d.DeviceId == deviceId);
            if (device == null)
            {
                return CoreResult<bool>.Failure([$"Device with id {deviceId} not found in automation {automationId}"]);
            }
            _mapper.Map(dto, device);
            var result = await _repository.UpdateAutomationAsync(entity.Data);

            return result.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(result.Errors);
        }
    }
}
