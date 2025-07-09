using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.Models;

namespace CasaBackend.Casa.Core.Entities
{
    public class LedEntity(DeviceModel model, DimmableEntity dimmable) :  DeviceEntity(model)
    {
        public override DeviceType DeviceType => DeviceType.Led;
        public DimmableEntity Dimmable { get; set; } = dimmable;
    }
}