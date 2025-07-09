using System.Text.Json;

namespace CasaBackend.Casa.API.DTOs
{
    public class CommandDto
    {
        public int DeviceId { get; set; }
        public string CommandName { get; set; }
        public Dictionary<string, JsonElement> Parameters { get; set; }

    }
}
