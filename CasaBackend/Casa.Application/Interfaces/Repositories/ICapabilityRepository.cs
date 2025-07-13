using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface ICapabilityRepository<TEntity>
    {
        Task<CoreResult<TEntity>> GetByDeviceIdAsync(int deviceId);
        Task<CoreResult<TEntity>> SaveEntityAsync(TEntity entity, int entityId);
    }
}
