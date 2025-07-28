namespace CasaBackend.Casa.Core.Entities
{
    public class RoomEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<int> DevicesId { get; set; } = [];
    }
}