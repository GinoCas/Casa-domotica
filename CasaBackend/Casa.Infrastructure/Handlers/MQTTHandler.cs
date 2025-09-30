using CasaBackend.Casa.Application.Interfaces.Handlers;
using System.Text.Json;

namespace CasaBackend.Casa.Infrastructure.Handlers
{
    public class MQTTHandler<T> : IMQTTHandler
    {
        public string Topic { get; }
        public event Action<string, T>? OnMessageReceived;
        private readonly List<T> _messagesHistory;
        public MQTTHandler(string topic)
        {
            Topic = topic;
            _messagesHistory = new List<T>();
        }

        public void Handle(string topic, string payloadJson)
        {
            var obj = JsonSerializer.Deserialize<T>(payloadJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if (obj != null)
            {
                Console.WriteLine($"Objeto: {obj}");
                _messagesHistory.Add(obj);
                OnMessageReceived?.Invoke(topic, obj);
            }
        }
        public IEnumerable<T> GetHistory()
        {
            Console.WriteLine("Se quiere obtener historia con:");
            foreach (var message in _messagesHistory)
            {
                Console.WriteLine($"Mensaje: {message}");
            }
            return _messagesHistory;
        }
    }
}
