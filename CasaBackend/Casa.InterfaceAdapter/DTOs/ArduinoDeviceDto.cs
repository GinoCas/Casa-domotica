using Newtonsoft.Json;

namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class ArduinoDeviceDto
    {
        [JsonProperty("Id")]
        public int ArduinoId { get; set; }
        public bool State { get; set; }
        public string Type { get; set; } = string.Empty;
        public int? Brightness { get; set; }
        public int? Speed { get; set; }
    }
}