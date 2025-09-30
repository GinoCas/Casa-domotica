using CasaBackend.Casa.Application.Interfaces.Handlers;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Helpers;

namespace CasaBackend.Casa.Application.Handlers
{
    public class CapabilityCommandHandler<TEntity> : ICommandHandler
        where TEntity : class, ICapabilityEntity<TEntity>, new()
    {
        private readonly ICapabilityRepository<TEntity> _repository;
        public string CommandName { get; }
        public IReadOnlyDictionary<string, Type> RequiredParameters { get; }
        public CapabilityCommandHandler(
            ICapabilityRepository<TEntity> repository, 
            string commandName, 
            IReadOnlyDictionary<string, Type> requiredParameters)
        {
            _repository = repository;
            CommandName = commandName;
            RequiredParameters = requiredParameters;
        }

        public async Task<CoreResult<bool>> HandleAsync(CommandEntity entity)
        {
            var getResult = await _repository.GetByDeviceIdAsync(entity.DeviceId);
            if (!getResult.IsSuccess) return CoreResult<bool>.Failure(getResult.Errors);

            var capability = getResult.Data;
            var sourceEntity = new TEntity
            {
                Id = capability.Id
            };

            var validateParametersResult = ParameterHelper.HasRequiredParameters(entity.Parameters.Keys, RequiredParameters.Keys);
            if (!validateParametersResult.IsSuccess) 
            {
                validateParametersResult.Errors.Add("El comando no recibio los parametros necesarios.");
                validateParametersResult.Errors.Add("Parametros necesarios: " + string.Join(", ", RequiredParameters.Keys));
                return CoreResult<bool>.Failure(validateParametersResult.Errors);
            }
            var mappingResult = ParameterHelper.MapParametersToEntity(sourceEntity, entity.Parameters);
            if (!mappingResult.IsSuccess) return CoreResult<bool>.Failure(mappingResult.Errors);

            var updateResult = capability.UpdateFrom(sourceEntity);
            if (!updateResult.IsSuccess) return CoreResult<bool>.Failure(updateResult.Errors);

            var saveResult = await _repository.SaveEntityAsync(capability, capability.Id);
            return saveResult.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(saveResult.Errors);
        }
    }

}
