using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;

namespace CasaBackend.Casa.Core.Entities
{
    public class LedEntity(DimmableEntity dimmable) : DeviceEntity
    {
        public override DeviceType DeviceType => DeviceType.Led;
        public DimmableEntity Dimmable { get; set; } = dimmable;
    }
}