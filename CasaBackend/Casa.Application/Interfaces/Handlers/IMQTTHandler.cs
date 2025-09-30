namespace CasaBackend.Casa.Application.Interfaces.Handlers
{
    public interface IMQTTHandler
    {
        string Topic { get; }
        void Handle(string topic, string payload);
    }
}
