using System.Text.Json;
using System.Text.Json.Serialization;

namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class CommandDto
    {
        public int DeviceId { get; set; }
        public string CommandName { get; set; } = string.Empty;
        public Dictionary<string, object> Parameters { get; set; } = [];

    }
}
