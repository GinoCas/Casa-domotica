using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Factory;

namespace CasaBackend.Casa.Application.Factories
{
    public class CommandFactory
    {
        private readonly IEnumerable<ICommandHandler> _commands;
        public CommandFactory(IEnumerable<ICommandHandler> commands)
        {
            _commands = commands;
        }
        public ICommandHandler Fabric(string commandName)
        {
            var cmd = _commands.FirstOrDefault(h => h.CommandName == commandName);
            return cmd ?? throw new NotSupportedException($"Comando '{commandName}' no soportado.");
        }
    }
}
