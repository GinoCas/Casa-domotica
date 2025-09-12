using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IAutomationRepository<TEntity>
    {
        Task<CoreResult<TEntity>> GetByAutomationIdAsync(int id);
        Task<CoreResult<IEnumerable<TEntity>>> GetAllAutomationsAsync();
        Task<CoreResult<TEntity>> CreateAutomationAsync(TEntity entity);
        Task<CoreResult<TEntity>> UpdateAutomationAsync(TEntity entity);
        Task<CoreResult<bool>> DeleteAutomationAsync(int id);
    }
}
