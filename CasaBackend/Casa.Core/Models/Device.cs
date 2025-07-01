using CasaBackend.Casa.Core.Models.ValueObjects;

namespace CasaBackend.Casa.Core.Models
{
    public abstract class Device
    {
        public int Id { get; set; }
        public int Pin { get; set; }
        public bool State { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public abstract DeviceType DeviceType { get; }
        
        public virtual void TurnOn()
        {
            State = true;
        }

        public virtual void TurnOff()
        {
            State = false;
        }
    }
}
