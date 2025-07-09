using System.Text.Json;

namespace CasaBackend.Casa.Core.Entities
{
    public class CommandEntity
    {
        public DeviceEntity Device { get; set; }
        public string CommandName { get; set; } = string.Empty;
        public Dictionary<string, JsonElement> Parameters { get; set; } = [];
    }
}
