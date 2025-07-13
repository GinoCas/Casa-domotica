using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.Application.Interfaces.Command
{
    public interface ICommandHandler
    {
        string CommandName { get; }
        IReadOnlyDictionary<string, Type> RequiredParameters { get; }
        Task<CoreResult<bool>> HandleAsync(CommandEntity entity);
    }
}
