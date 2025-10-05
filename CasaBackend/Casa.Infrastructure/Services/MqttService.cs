using CasaBackend.Casa.Application.Interfaces.Handlers;
using Microsoft.Extensions.DependencyInjection;
using MQTTnet;
using System.Text;

namespace CasaBackend.Casa.Infrastructure.Services
{
    public class MQTTService : BackgroundService
    {
        private readonly IMqttClient _mqttClient;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;

        public MQTTService(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _mqttClient = new MqttClientFactory().CreateMqttClient();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var mqttBroker = _configuration["MQTT_BROKER"];
            var mqttPortStr = _configuration["MQTT_PORT"];
            if (string.IsNullOrEmpty(mqttBroker) || !int.TryParse(mqttPortStr, out var mqttPort))
            {
                Console.WriteLine("Error: MQTT Broker/Port is not configured correctamente.");
                return;
            }

            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(mqttBroker, mqttPort)
                .WithClientId("CasaBackend.API")
                .Build();

            _mqttClient.ApplicationMessageReceivedAsync += HandleMessageAsync;

            await _mqttClient.ConnectAsync(options, stoppingToken);

            // Create a scope to get the topics from the handlers
            using (var scope = _serviceProvider.CreateScope())
            {
                var handlers = scope.ServiceProvider.GetServices<IMQTTHandler>();
                foreach (var handler in handlers)
                {
                    await _mqttClient.SubscribeAsync(handler.Topic);
                    Console.WriteLine($"Suscrito al topic: {handler.Topic}");
                }
            }
        }

        private async Task HandleMessageAsync(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

            // Create a new scope for each message to resolve scoped services
            using (var scope = _serviceProvider.CreateScope())
            {
                var handlers = scope.ServiceProvider.GetServices<IMQTTHandler>();
                var handlingTasks = handlers
                    .Where(handler => handler.Topic == topic)
                    .Select(handler => handler.Handle(topic, payload));

                await Task.WhenAll(handlingTasks);
            }
        }
    }
}

