using CasaBackend.Casa.Core;
using System.Collections.Generic;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IDeviceRepository<TEntity>
    {
        Task<CoreResult<TEntity>> GetByDeviceIdAsync(int id);
        Task<CoreResult<IEnumerable<TEntity>>> GetAllDevicesAsync();
        Task<CoreResult<TEntity>> UpdateDeviceAsync(TEntity entity);
        Task<CoreResult<TEntity>> AddDeviceAsync(TEntity entity);
        Task<CoreResult<IEnumerable<TEntity>>> GetByDeviceIdsAsync(IEnumerable<int> ids);
        Task<CoreResult<IEnumerable<TEntity>>> UpsertDevicesAsync(IEnumerable<TEntity> entities);
    }
}
