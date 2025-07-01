namespace CasaBackend.Casa.Core.Interfaces.Repositories
{
    public interface IRepository<T>
    {
        Task<CoreResult<T>> GetByIdAsync(int id);
        Task<CoreResult<IEnumerable<T>>> GetAllAsync();
        Task<CoreResult<T>> CreateAsync(T room);
        Task<CoreResult<T>> UpdateAsync(T room);
        Task<CoreResult<bool>> DeleteAsync(int id);
    }
}
