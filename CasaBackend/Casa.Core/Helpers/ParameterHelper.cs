using System.Text.Json;

namespace CasaBackend.Casa.Core.Helpers
{
    public static class ParameterHelper
    {
        public static CoreResult<T> GetRequiredParameter<T>(Dictionary<string, JsonElement> parameters, string parameterName)
        {
            if (!parameters.TryGetValue(parameterName, out JsonElement value))
            {
                return CoreResult<T>.Failure([$"El comando no contiene el parámetro necesario: {parameterName}"]);
            }

            return TryConvertValue<T>(value, parameterName);
        }
        public static CoreResult<Dictionary<string, T>> GetMultipleParameters<T>(Dictionary<string, JsonElement> parameters, Dictionary<string, Type> requiredParameters)
        {
            var results = new Dictionary<string, T>();
            var errors = new List<string>();

            foreach (var paramName in requiredParameters.Keys)
            {
                var result = GetRequiredParameter<T>(parameters, paramName);
                if (result.IsSuccess)
                {
                    results[paramName] = result.Data;
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
        private static CoreResult<T> TryConvertValue<T>(JsonElement value, string parameterName)
        {
            try
            {
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
                return CoreResult<T>.Failure([$"El parámetro '{parameterName}' debe ser de tipo {typeof(T).Name}."]);
            }
        }
    }
}