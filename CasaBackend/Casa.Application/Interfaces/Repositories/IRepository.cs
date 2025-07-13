using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IRepository<T>
    {
        Task<CoreResult<T>> GetByIdAsync(int id);
        Task<CoreResult<IEnumerable<T>>> GetAllAsync();
        Task<CoreResult<T>> CreateAsync(T entity);
        Task<CoreResult<T>> UpdateAsync(T entity);
        Task<CoreResult<bool>> DeleteAsync(int id);
    }
}
