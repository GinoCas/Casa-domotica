using CasaBackend.Casa.Core.Interfaces.Command;
using CasaBackend.Casa.Core.Models;

namespace CasaBackend.Casa.Infrastructure.Commands
{
    public class BrightnessCommand : ICommand
    {
        public string CommandName => "SetBrightness";
        private readonly Device Device;
        private readonly int Brightness;
        public BrightnessCommand(Device device, int brightness)
        {
            Device = device;
            Brightness = brightness;
        }
        public void Execute()
        {
            throw new NotImplementedException();
        }
        public bool CanExecute()
        {
            return true;
        }
    }
}
