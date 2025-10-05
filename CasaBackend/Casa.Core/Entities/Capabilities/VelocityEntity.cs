namespace CasaBackend.Casa.Core.Entities.Capabilities
{
    public class VelocityEntity : ICapabilityEntity<VelocityEntity>
    {
        public int Id { get; set; }
        public DeviceEntity Device { get; set; }
        public int Speed { get; set; }
        public CoreResult<bool> UpdateFrom(VelocityEntity source)
        {
            if (source.Speed < 0 || source.Speed > 5) return CoreResult<bool>.Failure(["El valor de 'speed' debe estar en el rango permitido (0-5)."]);
            Speed = source.Speed;
            return CoreResult<bool>.Success(true);
        }
    }
}
