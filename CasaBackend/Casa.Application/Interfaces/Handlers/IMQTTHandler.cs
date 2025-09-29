namespace CasaBackend.Casa.Application.Interfaces.Handlers
{
    public interface IMQTTHandler<TDTO>
    {
        string Topic { get; }
        TDTO HandleMessageAsync(string payload);
        Task HandlePublishAsync(TDTO dto);
    }
}
