using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Core.Interfaces.Services
{
    public interface ICommandService
    {
        Task<CoreResult<bool>> ExecuteAsync(CommandDto dto);
    }
}
