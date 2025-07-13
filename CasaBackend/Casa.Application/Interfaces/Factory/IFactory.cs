using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Factory
{
    public interface IFactory<TOutput, TInput>
    {
        CoreResult<TOutput> Fabric(TInput input);
    }
}
