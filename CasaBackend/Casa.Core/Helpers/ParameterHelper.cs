using System.Reflection;
using System.Text.Json;

namespace CasaBackend.Casa.Core.Helpers
{
    public static class ParameterHelper
    {
        public static CoreResult<IEnumerable<string>> HasRequiredParameters(
            IEnumerable<string> actualParameters,
            IEnumerable<string> requiredParameters)
        {
            var requiredSet = new HashSet<string>(requiredParameters, StringComparer.OrdinalIgnoreCase);
            List<string> errors = [.. actualParameters
                .Where(key => !requiredSet.Contains(key))
                .Select(key => $"Llave de parámetro invalido: '{key}'")];

            return errors.Count != 0
                ? CoreResult<IEnumerable<string>>.Failure(errors)
                : CoreResult<IEnumerable<string>>.Success(Enumerable.Empty<string>());
        }
        public static CoreResult<bool> MapParametersToEntity<TEntity>(TEntity entity, Dictionary<string, object> parameters)
        {
            var errors = new List<string>();
            var entityType = typeof(TEntity);
            foreach (var param in parameters)
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