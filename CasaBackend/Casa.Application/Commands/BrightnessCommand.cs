using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Helpers;

namespace CasaBackend.Casa.Application.Commands
{
    public class BrightnessCommand : ICommandHandler
    {
        private readonly ICapabilityRepository<DimmableEntity> _repository;
        public Dictionary<string, Type> RequiredParameters => new()
        {
                { "brightness", typeof(int) }
        };
        public string CommandName => "SetBrightness";
        public BrightnessCommand(ICapabilityRepository<DimmableEntity> repository)
        {
            _repository = repository;
        }
        public async Task<CoreResult<bool>> HandleAsync(CommandEntity entity)
        {
            var getResult = await _repository.GetByDeviceIdAsync(entity.DeviceId);
            if (!getResult.IsSuccess) return CoreResult<bool>.Failure(getResult.Errors);
            var device = getResult.Data;

            var parameterResult = ParameterHelper.GetMultipleParameters<int>(entity.Parameters, RequiredParameters);
            if (!parameterResult.IsSuccess) return CoreResult<bool>.Failure(parameterResult.Errors);

            var brightness = parameterResult.Data["brightness"];
            var setResult = device.SetBrightness(brightness);
            if (!setResult.IsSuccess) return CoreResult<bool>.Failure(setResult.Errors);

            var saveResult = await _repository.SaveEntityAsync(device, device.Id);
            return saveResult.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(saveResult.Errors);
        }
    }
}
