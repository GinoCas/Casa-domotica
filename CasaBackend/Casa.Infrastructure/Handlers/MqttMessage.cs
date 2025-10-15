using Newtonsoft.Json;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class MqttMessage<T>
    {
        [JsonProperty("Data")]
        public T Data { get; set; }
    }
}