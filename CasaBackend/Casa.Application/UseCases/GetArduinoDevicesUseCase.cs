using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Infrastructure.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Application.UseCases
{
    public class GetArduinoDevicesUseCase(MQTTService mqttService)
    {
        private readonly MQTTService _mqttService = mqttService;
        public async Task ExecuteAsync()
        {
            var handler = _mqttService.GetHandler<ArduinoMessageDto<ArduinoDeviceDto>>();
            if (handler != null)
            {
                handler.GetHistory();
            }
        }
    }
}
