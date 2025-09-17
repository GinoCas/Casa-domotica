using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IRoomRepository<TEntity>
    {
        Task<CoreResult<TEntity>> GetByRoomNameAsync(string name);
        Task<CoreResult<IEnumerable<TEntity>>> GetAllRoomsAsync();
    }
}