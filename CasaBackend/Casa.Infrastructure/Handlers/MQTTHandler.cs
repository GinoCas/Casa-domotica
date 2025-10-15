using CasaBackend.Casa.Application.Interfaces.Handlers;
using Newtonsoft.Json;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public abstract class MQTTHandler<TDTO> : IMQTTHandler
    {
        public string Topic { get; }
        private readonly List<TDTO> _messagesHistory;
        private readonly ILogger<MQTTHandler<TDTO>> _logger;

        protected MQTTHandler(string topic, ILogger<MQTTHandler<TDTO>> logger)
        {
            Topic = topic;
            _logger = logger;
            _messagesHistory = new List<TDTO>();
        }

        public async Task Handle(string topic, string payloadJson)
        {
            try
            {
                var message = JsonConvert.DeserializeObject<MqttMessage<TDTO>>(payloadJson);

                if (message != null && message.Data != null)
                {
                    _messagesHistory.Add(message.Data);
                    await ProcessMessageAsync(message.Data);
                }
                else
                {
                    _logger.LogWarning("El mensaje recibido en el topic {Topic} no pudo ser deserializado a {DTOType}.", topic, typeof(TDTO).Name);
                }
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error al deserializar el mensaje del topic {Topic}. Payload: {Payload}", topic, payloadJson);
            }
        }

        protected abstract Task ProcessMessageAsync(TDTO dto);

        public IEnumerable<TDTO> GetHistory()
        {
            return _messagesHistory;
        }
    }
}
