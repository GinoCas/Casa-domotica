using CasaBackend.Casa.Core.Interfaces.Device;
using CasaBackend.Casa.Core.Models.ValueObjects;

namespace CasaBackend.Casa.Core.Models
{
    public class LedDevice : Device, IDimmable
    {
        public override DeviceType DeviceType => DeviceType.Led;
        public int Brightness { get; set; } = 255;
        public int[] Limits => [0, 255];
    }
}