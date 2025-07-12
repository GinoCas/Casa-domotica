using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;

namespace CasaBackend.Casa.Application.Commands
{
    public class BrightnessCommand : ICommandHandler
    {
        private readonly ICapabilityRepository<DimmableEntity> _repository;
        public string CommandName => "SetBrightness";
        public BrightnessCommand(ICapabilityRepository<DimmableEntity> repository)
        {
            _repository = repository;
        }
        public async Task HandleAsync(CommandEntity entity)
        {
            var dev = await _repository.GetByDeviceIdAsync(entity.DeviceId);
            var brightness = entity.Parameters["brightness"].GetInt32();
            if (brightness < dev.Limits[0] || brightness > dev.Limits[1])
            {
                throw new ArgumentOutOfRangeException(nameof(brightness), 
                    $"El valor debe estar en el rango permitido ({dev.Limits[0]}-{dev.Limits[1]})."
                );
            }
            dev.Brightness = brightness;
            await _repository.SaveEntityAsync(dev, dev.Id);
        }
    }
}
