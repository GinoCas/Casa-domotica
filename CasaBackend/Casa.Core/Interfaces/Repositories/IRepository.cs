namespace CasaBackend.Casa.Core.Interfaces.Repositories
{
    public interface IRepository<T>
    {
        Task<CoreResult<T>> GetByIdAsync(int id);
        Task<CoreResult<IEnumerable<T>>> GetAllAsync();
        Task<CoreResult<T>> CreateAsync(T model);
        Task<CoreResult<T>> UpdateAsync(T model);
        Task<CoreResult<bool>> DeleteAsync(int id);
    }
}
