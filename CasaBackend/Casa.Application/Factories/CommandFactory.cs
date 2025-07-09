using CasaBackend.Casa.Application.Interfaces.Command;

namespace CasaBackend.Casa.Application.Factories
{
    public class CommandFactory
    {
        private readonly IEnumerable<ICommandHandler> _commands;
        public CommandFactory(IEnumerable<ICommandHandler> commands)
        {
            _commands = commands;
        }
        public ICommandHandler GetCommand(string commandName)
        {
            var cmd = _commands.FirstOrDefault(h => h.CommandName == commandName);
            return cmd ?? throw new NotSupportedException($"Comando '{commandName}' no soportado.");
        }
    }
}
