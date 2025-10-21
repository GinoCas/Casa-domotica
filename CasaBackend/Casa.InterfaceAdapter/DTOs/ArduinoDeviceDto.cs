using System.Text.Json.Serialization;

namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class ArduinoDeviceDto
    {
        public int Id { get; set; }
        public bool State { get; set; }
        public string? Type { get; set; } = string.Empty;
        public int? Brightness { get; set; }
        public int? Speed { get; set; }
		[JsonConverter(typeof(Newtonsoft.Json.Converters.UnixDateTimeConverter))]
		public DateTime LastModified { get; set; }
    }
}