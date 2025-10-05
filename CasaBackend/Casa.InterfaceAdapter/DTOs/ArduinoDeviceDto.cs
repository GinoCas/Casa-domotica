using Newtonsoft.Json;

namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class ArduinoDeviceDto
    {
        public int Id { get; set; }

        [JsonProperty("State")]
        public bool IsOn { get; set; }
    }
}