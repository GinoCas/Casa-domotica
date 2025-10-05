namespace CasaBackend.Casa.Application.Interfaces.Handlers
{
    public interface IMQTTHandler
    {
        string Topic { get; }
        Task Handle(string topic, string payloadJson);
    }
}
