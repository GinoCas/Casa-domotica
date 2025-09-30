using CasaBackend.Casa.Application.Interfaces.Handlers;
using CasaBackend.Casa.Infrastructure.Handlers;
using MQTTnet;
using System.Text;

namespace CasaBackend.Casa.Infrastructure.Services
{
    public class MQTTService
    {
        private readonly IMqttClient _mqttClient;
        private readonly IConfiguration _configuration;
        private readonly IEnumerable<IMQTTHandler> _handlers;
        public event Action<string, string> OnMessageReceived;

        public MQTTService(IConfiguration configuration, IEnumerable<IMQTTHandler> handlers)
        {
            _configuration = configuration;
            _handlers = handlers;
            _mqttClient = new MqttClientFactory().CreateMqttClient();
        }
        public async Task ConnectAsync()
        {
            var mqttBroker = _configuration["MQTT_BROKER"];
            var mqttPortStr = _configuration["MQTT_PORT"];
            if (string.IsNullOrEmpty(mqttBroker) || !int.TryParse(mqttPortStr, out var mqttPort))
            {
                Console.WriteLine("Error: MQTT Broker/Port is not configured correctly.");
                return;
            }
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(mqttBroker, mqttPort)
                .WithClientId("CasaBackend.API")
                .Build();

            _mqttClient.ApplicationMessageReceivedAsync += HandleMessageAsync;

            await _mqttClient.ConnectAsync(options, CancellationToken.None);

            foreach (var handler in _handlers)
            {
                await _mqttClient.SubscribeAsync(handler.Topic);
                Console.WriteLine($"Suscrito al topic: {handler.Topic}");
            }
        }
        private Task HandleMessageAsync(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            foreach (var handler in _handlers)
            {
                if (handler.Topic == topic)
                {
                    handler.Handle(topic, payload);
                }
            }
            return Task.CompletedTask;
        }
        public MQTTHandler<T>? GetHandler<T>() 
        {
            foreach (var handler in _handlers)
            {
                if (handler.GetType() == typeof(MQTTHandler<T>))
                {
                    return (MQTTHandler<T>)handler;
                }
            }
            return default(MQTTHandler<T>);
        }
    }
}

