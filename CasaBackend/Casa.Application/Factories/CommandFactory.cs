using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Factory;

namespace CasaBackend.Casa.Application.Factories
{
    public class CommandFactory(IEnumerable<ICommandHandler> commands) : IFactory<ICommandHandler, string>
    {
        private readonly IEnumerable<ICommandHandler> _commands = commands
        public ICommandHandler Fabric(string commandName)
        {
            var cmd = _commands.FirstOrDefault(h => h.CommandName == commandName);
            return cmd ?? throw new NotSupportedException($"Comando '{commandName}' no soportado.");
        }
    }
}
