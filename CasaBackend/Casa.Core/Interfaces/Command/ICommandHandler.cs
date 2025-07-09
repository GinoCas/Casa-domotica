using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.Core.Interfaces.Command
{
    public interface ICommandHandler
    {
        string CommandName { get; }
        Task HandleAsync(CommandEntity entity);
    }
}
