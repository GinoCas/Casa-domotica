﻿using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Helpers;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace CasaBackend.Casa.Application.Commands
{
    public class CapabilityCommand<TEntity> : ICommandHandler
        where TEntity : class, ICapabilityEntity<TEntity>, new()
    {
        private readonly ICapabilityRepository<TEntity> _repository;
        public string CommandName { get; }
        public IReadOnlyDictionary<string, Type> RequiredParameters { get; }
        public CapabilityCommand(
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

            var parameterResult = ParameterHelper.ConvertMultipleJsonElementToExactTypes(RequiredParameters, entity.Parameters.Values);
            if (!parameterResult.IsSuccess) return CoreResult<bool>.Failure(parameterResult.Errors);
            
            var mappingResult = MapParametersToEntity(sourceEntity, parameterResult.Data);
            if (!mappingResult.IsSuccess) return CoreResult<bool>.Failure(mappingResult.Errors);

            var updateResult = capability.UpdateFrom(sourceEntity);
            if (!updateResult.IsSuccess) return CoreResult<bool>.Failure(updateResult.Errors);

            var saveResult = await _repository.SaveEntityAsync(capability, capability.Id);
            return saveResult.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(saveResult.Errors);
        }
        private static CoreResult<bool> MapParametersToEntity(TEntity entity, Dictionary<string, object> parameters)
        {
            var errors = new List<string>();
            var entityType = typeof(TEntity);
            foreach(var param in parameters)
            {
                var property = entityType.GetProperty(param.Key, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property == null || !property.CanWrite) 
                {
                    errors.Add($"Propiedad '{param.Key}' no encontrada o no es escribible");
                    continue;
                }
                try
                {
                    var targetType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                    var convertedValue = Convert.ChangeType(param.Value, targetType);
                    property.SetValue(entity, convertedValue);
                }
                catch (Exception ex)
                {
                    errors.Add($"Error al convertir el parámetro '{param.Key}' a tipo {property.PropertyType.Name}: {ex.Message}");
                }
            }
            return errors.Count > 0
                ? CoreResult<bool>.Failure(errors)
                : CoreResult<bool>.Success(true);
        }
    }

}
