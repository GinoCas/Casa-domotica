using CasaBackend.Casa.API.DTOs;

namespace CasaBackend.Casa.Core.Interfaces.Services
{
    public interface ICommandService
    {
        Task<CoreResult<bool>> ExecuteAsync(CommandDto dto);
    }
}
