using CasaBackend.Casa.Application.Interfaces.Handlers;
using MQTTnet;
using System.Text;

namespace CasaBackend.Casa.Infrastructure.Services
{
	public class MQTTService<TEntity>
	{
		private readonly IMqttClient _mqttClient;
		private readonly IConfiguration _configuration;
        //private readonly Dictionary<string, IMQTTHandler> _handlers;

        public MQTTService(IConfiguration configuration)
		{
			_configuration = configuration;
			_mqttClient = new MqttClientFactory().CreateMqttClient();
			_mqttClient.ApplicationMessageReceivedAsync += HandleReceivedApplicationMessageAsync;

            var mqttBroker = _configuration["MQTT_BROKER"];
            var mqttPortVar = _configuration["MQTT_PORT"];

            if (string.IsNullOrEmpty(mqttBroker) || !int.TryParse(mqttPortVar, out var mqttPort))
            {
                Console.WriteLine("Error: MQTT Broker/Port is not configured correctly.");
                return;
            }
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(mqttBroker, mqttPort)
                .WithClientId("CasaBackend.API")
                .Build();

            _mqttClient.ConnectAsync(options, CancellationToken.None).Wait();
        }

		private Task HandleReceivedApplicationMessageAsync(MqttApplicationMessageReceivedEventArgs arg)
		{
            /*var topic = arg.ApplicationMessage.Topic;
            var payload = Encoding.UTF8.GetString(arg.ApplicationMessage.PayloadSegment);

            if (_handlers.TryGetValue(topic, out var handler))
            {
                await handler.HandleMessageAsync(payload);
            }*/
            throw new NotImplementedException();
        }
	}
}

