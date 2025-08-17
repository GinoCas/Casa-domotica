using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Helpers;

namespace CasaBackend.Casa.Application.Commands
{
    public class SetStateCommand(
        IRepository<DeviceEntity> repository,
        string commandName,
        IReadOnlyDictionary<string, Type> requiredParameters) : ICommandHandler
    {
        private readonly IRepository<DeviceEntity> _repository = repository;
        public string CommandName { get; } = commandName;
        public IReadOnlyDictionary<string, Type> RequiredParameters { get; } = requiredParameters;

        public async Task<CoreResult<bool>> HandleAsync(CommandEntity entity)
        {
            var getDeviceResult = await _repository.GetByIdAsync(entity.DeviceId);
            if (!getDeviceResult.IsSuccess) return CoreResult<bool>.Failure(getDeviceResult.Errors);

            var device = getDeviceResult.Data;
            var validateParametersResult = ParameterHelper.HasRequiredParameters(entity.Parameters.Keys, RequiredParameters.Keys);
            if (!validateParametersResult.IsSuccess)
            {
                validateParametersResult.Errors.Add("El comando no recibio los parametros necesarios.");
                validateParametersResult.Errors.Add("Parametros necesarios: " + string.Join(", ", RequiredParameters.Keys));
                return CoreResult<bool>.Failure(validateParametersResult.Errors);
            }
            var mappingResult = ParameterHelper.MapParametersToEntity(device, entity.Parameters);
            if (!mappingResult.IsSuccess) return CoreResult<bool>.Failure(mappingResult.Errors);
            var updateResult = await _repository.UpdateAsync(device);
            return updateResult.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(updateResult.Errors);
        }
    }
}
