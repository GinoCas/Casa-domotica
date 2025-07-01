using CasaBackend.Casa.Core.Models.ValueObjects;

namespace CasaBackend.Casa.Core.Models
{
    public class FanDevice : Device
    {
        public override DeviceType DeviceType => DeviceType.Fan;
        public int Speed { get; private set; } = 0;
        public bool HasReverse { get; set; } = false;
        public bool IsReversed { get; private set; } = false;
        
        public override void TurnOn()
        {
            base.TurnOn();
            Speed = 1;
        }
        
        public override void TurnOff()
        {
            base.TurnOff();
            Speed = 0;
        }
        
        public void SetSpeed(int speed)
        {
            Speed = speed;
        }
        
        public void ToggleReverse()
        {
            if (!HasReverse)
                throw new InvalidOperationException("Este ventilador no soporta reversa");
            
            IsReversed = !IsReversed;
        }
    }
}