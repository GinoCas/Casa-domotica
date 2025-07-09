using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.Application.Interfaces.Services
{
    public interface ICommandService
    {
        Task<CoreResult<bool>> ExecuteAsync(CommandEntity dto);
    }
}
