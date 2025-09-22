using MQTTnet;
using System.Text.Json;

namespace CasaBackend.Casa.Infrastructure.Services
{
    public class MqttService<TEntity>
    {
        private readonly IMqttClient _mqttClient;
        private readonly IConfiguration _configuration;
        private MqttClientOptions? _mqttOptions;

        public MqttService(IConfiguration configuration)
        {
            _configuration = configuration;
            _mqttClient = new MqttClientFactory().CreateMqttClient();
        }

        private async Task ConnectAsync()
        {
            if (_mqttClient.IsConnected)
            {
                return;
            }

            if (_mqttOptions == null)
            {
                var mqttBroker = _configuration["MQTT_BROKER"];
                var mqttPortVar = _configuration["MQTT_PORT"];

                if (string.IsNullOrEmpty(mqttBroker) || !int.TryParse(mqttPortVar, out var mqttPort))
                {
                    Console.WriteLine("Error: MQTT Broker/Port is not configured correctly.");
                    return;
                }
                _mqttOptions = new MqttClientOptionsBuilder()
                    .WithTcpServer(mqttBroker, mqttPort)
                    .WithClientId("CasaBackend.API")
                    .Build();
            }

            try
            {
                await _mqttClient.ConnectAsync(_mqttOptions, CancellationToken.None);
                Console.WriteLine("Successfully connected to MQTT broker.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error connecting to MQTT broker: {ex.Message}");
                throw;
            }
        }

        public async Task PublishAsync(TEntity entity)
        {
            Console.WriteLine("Publishing entity to MQTT...");
            await ConnectAsync();

            if (!_mqttClient.IsConnected)
            {
                Console.WriteLine("Cannot publish message, MQTT client is not connected.");
                return;
            }

            var topic = "casa/devices";
            var payload = JsonSerializer.Serialize(entity);
            var message = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(payload)
                .WithRetainFlag()
                .Build();
            
            await _mqttClient.PublishAsync(message, CancellationToken.None);
            Console.WriteLine($"Entity published successfully to topic {topic}");
        }
    }
}

