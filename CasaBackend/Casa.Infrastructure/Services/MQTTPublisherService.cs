using CasaBackend.Casa.Application.Interfaces.Services;
using MQTTnet;
using Newtonsoft.Json;
using System.Text;

namespace CasaBackend.Casa.Infrastructure.Services
{
    public class MQTTPublisherService : IMQTTPublisher
    {
        private readonly IMqttClient _mqttClient;
        private readonly IConfiguration _configuration;
        private bool _isConnected = false;

        public MQTTPublisherService(IConfiguration configuration)
        {
            _configuration = configuration;
            _mqttClient = new MqttClientFactory().CreateMqttClient();
        }

        public async Task ConnectAsync()
        {
            if (_isConnected && _mqttClient.IsConnected)
                return;

            var mqttBroker = _configuration["MQTT_BROKER"];
            var mqttPortStr = _configuration["MQTT_PORT"];
            if (string.IsNullOrEmpty(mqttBroker) || !int.TryParse(mqttPortStr, out var mqttPort))
            {
                throw new InvalidOperationException("Error: MQTT Broker/Port is not configured correctly.");
            }

            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(mqttBroker, mqttPort)
                .WithClientId($"CasaBackend.Publisher.{Guid.NewGuid()}")
                .Build();

            await _mqttClient.ConnectAsync(options);
            _isConnected = true;
        }

        public async Task PublishAsync<T>(string topic, T payload)
        {
            var jsonPayload = JsonConvert.SerializeObject(payload);
            await PublishAsync(topic, jsonPayload);
        }

        public async Task PublishAsync(string topic, string payload)
        {
            if (!_isConnected)
                await ConnectAsync();

            var message = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(Encoding.UTF8.GetBytes(payload))
                .Build();

            await _mqttClient.PublishAsync(message);
        }
    }
}