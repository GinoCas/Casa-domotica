using CasaBackend.Casa.Core.Interfaces.Command;
using CasaBackend.Casa.Core.Interfaces.Device;
using CasaBackend.Casa.Core.Models;

namespace CasaBackend.Casa.Infrastructure.Commands
{
    public class BrightnessCommand : ICommand
    {
        public string CommandName => "SetBrightness";
        private readonly IDimmable _dimmable;
        private readonly int _brightness;
        public BrightnessCommand(IDimmable dimmable, int brightness)
        {
            _dimmable = dimmable;
            _brightness = brightness;
        }
        public void Execute()
        {
            if (_brightness < _dimmable.Limits[0] || _brightness > _dimmable.Limits[1])
            {
                throw new ArgumentOutOfRangeException(nameof(_brightness), 
                    $"El valor debe estar en el rango permitido ({_dimmable.Limits[0]}-{_dimmable.Limits[1]})."
                );
            }
            _dimmable.Brightness = _brightness;
        }
    }
}
