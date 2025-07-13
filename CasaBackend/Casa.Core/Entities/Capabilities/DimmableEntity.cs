namespace CasaBackend.Casa.Core.Entities.Capabilities
{
    public class DimmableEntity : ICapabilityEntity<DimmableEntity>
    {
        public int Id { get; set; }
        public int Brightness { get; set; }
        public int[] Limits => [0, 255];
        public CoreResult<bool> UpdateFrom(DimmableEntity source)
        {
            if (source.Brightness < Limits[0] || source.Brightness > Limits[1]) 
                return CoreResult<bool>.Failure([$"El valor de 'brightness' debe estar en el rango permitido ({Limits[0]}-{Limits[1]})."]);
            Brightness = source.Brightness;
            return CoreResult<bool>.Success(true);
        }
    }
}
