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
        public static CoreResult<Dictionary<string, object>> ConvertMultipleJsonElementToExactTypes(IReadOnlyDictionary<string, Type> requiredParameters, IEnumerable<JsonElement> actualValues)
        {
            var errors = new List<string>();
            var results = new Dictionary<string, object>();
            var actualValuesEnumerator = actualValues.GetEnumerator();
            foreach (var param in requiredParameters)
            {
                if (!actualValuesEnumerator.MoveNext())
                {
                    errors.Add($"No se encontraron suficientes valores para el parámetro: {param.Key}");
                    continue;
                }
                KeyValuePair<string, JsonElement> actualParam = new(param.Key, actualValuesEnumerator.Current);
                var result = TryConvertToExpectedType(actualParam, param.Value);
                if (result.IsSuccess)
                {
                    results[param.Key] = result.Data;
                }
                else
                {
                    errors.AddRange(result.Errors);
                }
            }

            return errors.Count != 0
                ? CoreResult<Dictionary<string, object>>.Failure(errors)
                : CoreResult<Dictionary<string, object>>.Success(results);
        }
        private static CoreResult<object> TryConvertToExpectedType(KeyValuePair<string, JsonElement> parameter, Type expectedType)
        {
            var value = parameter.Value;
            var paramName = parameter.Key;
            try
            {
                object? convertedValue = expectedType switch
                {
                    Type t when t == typeof(int) => value.GetInt32(),
                    Type t when t == typeof(bool) => value.GetBoolean(),
                    Type t when t == typeof(string) => value.GetString() ?? string.Empty,
                    Type t when t == typeof(double) => value.GetDouble(),
                    Type t when t == typeof(decimal) => value.GetDecimal(),
                    Type t when t == typeof(long) => value.GetInt64(),
                    Type t when t == typeof(float) => value.GetSingle(),
                    _ => JsonSerializer.Deserialize(value.GetRawText(), expectedType) ?? throw new InvalidOperationException()
                };
                return CoreResult<object>.Success(convertedValue);
            }
            catch (Exception ex)
            {
                return CoreResult<object>.Failure([$"Error al convertir el parámetro '{paramName}' a tipo {expectedType.Name}: {ex.Message}"]);
            }
        }
    }
}