namespace CasaBackend.Casa.Core.Entities
{
    public class ModeEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool State { get; set; }
        public DateTime LastChanged { get; set; }
    }
}