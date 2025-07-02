namespace CasaBackend.Casa.Core.Interfaces.Command
{
    public interface ICommand
    {
        string CommandName { get; }
        void Execute();
    }
}
