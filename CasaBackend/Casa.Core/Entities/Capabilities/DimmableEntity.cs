namespace CasaBackend.Casa.Core.Entities.Capabilities
{
    public class DimmableEntity
    {
        public int Id { get; set; }
        public int Brightness { get; set; }
        public int[] Limits => [0, 255];
        public CoreResult<bool> SetBrightness(int brightness)
        {
            if (brightness < Limits[0] || brightness > Limits[1]) return CoreResult<bool>.Failure([$"El valor de 'brightness' debe estar en el rango permitido ({Limits[0]}-{Limits[1]})."]);
            Brightness = brightness;
            return CoreResult<bool>.Success(true);
        }
    }
}
