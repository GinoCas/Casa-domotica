using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.Models;

namespace CasaBackend.Casa.Core.Entities
{
    public class FanEntity(VelocityEntity velocity) : DeviceEntity
    {
        public override DeviceType DeviceType => DeviceType.Fan;
        public VelocityEntity Velocity { get; set; } = velocity;
    }
}