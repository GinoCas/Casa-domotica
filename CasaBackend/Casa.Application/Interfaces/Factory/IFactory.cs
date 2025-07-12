namespace CasaBackend.Casa.Application.Interfaces.Factory
{
    public interface IFactory<TOutput, TInput>
    {
        TOutput Fabric(TInput input);
    }
}
