namespace CasaBackend.Casa.Core.Entities.Capabilities
{
    public class DimmableEntity
    {
        public int Id { get; set; }
        public int Brightness { get; set; }
        public int[] Limits => [0, 255];
    }
}
