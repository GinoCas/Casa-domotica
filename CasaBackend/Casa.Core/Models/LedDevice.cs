using CasaBackend.Casa.Core.Models.ValueObjects;

namespace CasaBackend.Casa.Core.Models
{
    public class LedDevice : Device
    {
        public override DeviceType DeviceType => DeviceType.Led;
        public int Brightness { get; private set; } = 255;
        public bool IsDimmable { get; set; } = true;
        
        public override void TurnOn()
        {
            base.TurnOn();
            if (Brightness == 0)
                Brightness = 255;
        }
        
        public override void TurnOff()
        {
            base.TurnOff();
        }
        
        public void SetBrightness(int brightness)
        {
            Brightness = brightness;
        }
    }
}