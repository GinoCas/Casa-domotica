using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Interfaces.Command;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Infrastructure.Repositories;

namespace CasaBackend.Casa.Infrastructure.Commands
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
            var dev = await _repository.GetByDeviceIdAsync(entity.Device.Id);
            var brightness = entity.Parameters["brightness"].GetInt32();
            if (brightness < dev.Limits[0] || brightness > dev.Limits[1])
            {
                throw new ArgumentOutOfRangeException(nameof(brightness), 
                    $"El valor debe estar en el rango permitido ({dev.Limits[0]}-{dev.Limits[1]})."
                );
            }
            dev.Brightness = brightness;
            await _repository.UpdateAsync(dev);
        }
    }
}
