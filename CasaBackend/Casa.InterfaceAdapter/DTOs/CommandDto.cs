using System.Text.Json;

namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class CommandDto
    {
        public int DeviceId { get; set; }
        public string CommandName { get; set; } = string.Empty;
        public Dictionary<string, JsonElement> Parameters { get; set; } = [];

    }
}
