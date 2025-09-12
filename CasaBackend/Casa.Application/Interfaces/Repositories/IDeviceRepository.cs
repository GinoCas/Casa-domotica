using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IDeviceRepository<TEntity>
    {
        Task<CoreResult<TEntity>> GetByDeviceIdAsync(int id);
        Task<CoreResult<IEnumerable<TEntity>>> GetAllDevicesAsync();
        Task<CoreResult<TEntity>> UpdateDeviceAsync(TEntity entity);
    }
}
