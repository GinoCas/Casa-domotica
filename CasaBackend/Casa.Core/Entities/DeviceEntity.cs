using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.Models;

namespace CasaBackend.Casa.Core.Entities
{
    public abstract class DeviceEntity
    {
        public int Id { get; set; }
        public int Pin { get; set; }
        public bool State { get; set; }
        public abstract DeviceType DeviceType { get; }
        protected DeviceEntity(DeviceModel model)
        {
            Id = model.Id;
            Pin = model.Pin;
            State = model.State;
        }
    }
}
