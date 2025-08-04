using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CasaBackend.Casa.Core
{
    public class CoreResult<T>(T data, bool success, ICollection<string> errors)
    {
        public T Data { get; } = data;
        public bool IsSuccess { get; } = success;
        public ICollection<string> Errors { get; } = errors;

        public string ToJson()
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            return JsonConvert.SerializeObject(this, settings);
        }
        public static CoreResult<T> Success(T data) => new(data, true, []);
        public static CoreResult<T> Failure(ICollection<string> errors) => new(default, false, errors);
    }
}
