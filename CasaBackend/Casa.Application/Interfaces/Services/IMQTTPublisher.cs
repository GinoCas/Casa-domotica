namespace CasaBackend.Casa.Application.Interfaces.Services
{
    public interface IMQTTPublisher
    {
        Task PublishAsync<T>(string topic, T payload);
        Task PublishAsync(string topic, string payload);
        Task ConnectAsync();
    }
}