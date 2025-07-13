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
        public static CoreResult<Dictionary<string, T>> ConvertMultipleParameters<T>(Dictionary<string, JsonElement> parameters)
        {
            var errors = new List<string>();
            var results = new Dictionary<string, T>();
            foreach (var param in parameters)
            {
                var result = TryConvert<T>(param);
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
                ? CoreResult<Dictionary<string, T>>.Failure(errors)
                : CoreResult<Dictionary<string, T>>.Success(results);
        }
        private static CoreResult<T> TryConvert<T>(KeyValuePair<string, JsonElement> parameter)
        {
            try
            {
                var value = parameter.Value;
                object? convertedValue = value.ValueKind switch
                {
                    JsonValueKind.String => value.GetString(),
                    JsonValueKind.Number => typeof(T) == typeof(int) ? value.GetInt32() :
                                            typeof(T) == typeof(long) ? value.GetInt64() :
                                            typeof(T) == typeof(double) ? value.GetDouble() :
                                            value.GetDecimal(),
                    JsonValueKind.True => value.GetBoolean(),
                    JsonValueKind.False => value.GetBoolean(),
                    JsonValueKind.Object => JsonSerializer.Deserialize(value.GetRawText(), typeof(T)),
                    JsonValueKind.Array => JsonSerializer.Deserialize(value.GetRawText(), typeof(T)),
                    _ => throw new InvalidOperationException($"Tipo JSON no soportado: {value.ValueKind}")
                };
                return convertedValue == null ? throw new InvalidOperationException() : CoreResult<T>.Success((T)convertedValue);
            }
            catch
            {
                return CoreResult<T>.Failure([$"El parámetro '{parameter.Key}' debe ser de tipo {typeof(T).Name}."]);
            }
        }
    }
}