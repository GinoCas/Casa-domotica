using CasaBackend.Casa.Application.Interfaces.Handlers;
using MQTTnet;
using Newtonsoft.Json;
using System;
using System.Text;

namespace CasaBackend.Casa.Infrastructure.Services
{
    public class MQTTListenerService : BackgroundService
    {
        private readonly IMqttClient _mqttClient;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;

        public MQTTListenerService(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _mqttClient = new MqttClientFactory().CreateMqttClient();
        }

        public async Task PublishAsync<T>(string topic, T payload)
        {
            var jsonPayload = JsonConvert.SerializeObject(payload);
            await PublishAsync(topic, jsonPayload);
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
                .WithCleanSession(false)
                .WithKeepAlivePeriod(TimeSpan.FromSeconds(60))
                .Build();

            _mqttClient.ApplicationMessageReceivedAsync += HandleMessageAsync;
            _mqttClient.DisconnectedAsync += async e =>
            {
                Console.WriteLine($"MQTT desconectado: {e.Reason}. Intentando reconexión...");
                await Task.CompletedTask;
            };

            // Bucle de mantenimiento de conexión con reintentos y resuscripción
            while (!stoppingToken.IsCancellationRequested)
            {
                if (!_mqttClient.IsConnected)
                {
                    try
                    {
                        await _mqttClient.ConnectAsync(options, stoppingToken);
                        await SubscribeHandlersAsync();
                        Console.WriteLine("Conectado a MQTT y resuscrito a los topics.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error conectando a MQTT: {ex.Message}");
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        private async Task SubscribeHandlersAsync()
        {
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

