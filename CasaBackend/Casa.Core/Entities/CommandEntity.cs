namespace CasaBackend.Casa.Core.Entities
{
    public class CommandEntity
    {
        public int DeviceId { get; set; }
        public string CommandName { get; set; } = string.Empty;
        public Dictionary<string, object> Parameters { get; set; } = [];
    }
}
