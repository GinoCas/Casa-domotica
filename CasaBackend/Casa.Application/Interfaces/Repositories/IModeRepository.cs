using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IModeRepository<TEntity>
    {
        Task<CoreResult<IEnumerable<TEntity>>> GetAllModesAsync();
        Task<CoreResult<TEntity>> GetByNameAsync(string name);
        Task<CoreResult<TEntity>> CreateModeAsync(TEntity entity);
        Task<CoreResult<TEntity>> UpdateModeAsync(TEntity entity);
    }
}