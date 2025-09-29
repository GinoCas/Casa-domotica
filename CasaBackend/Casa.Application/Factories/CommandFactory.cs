using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Handlers;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Factories
{
    public class CommandFactory(IEnumerable<ICommandHandler> commands) : IFactory<ICommandHandler, string>
    {
        private readonly IEnumerable<ICommandHandler> _commands = commands;
        public CoreResult<ICommandHandler> Fabric(string commandName)
        {
            var cmd = _commands.FirstOrDefault(h => h.CommandName == commandName);
            return cmd is null
                ? CoreResult<ICommandHandler>.Failure([$"Comando '{commandName}' no soportado."])
                : CoreResult<ICommandHandler>.Success(cmd);
        }
    }
}
