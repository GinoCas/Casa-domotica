using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities.Capabilities;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface ICapabilityRepository<TEntity> where TEntity : class, ICapabilityEntity<TEntity>
    {
        Task<CoreResult<TEntity>> GetByDeviceIdAsync(int deviceId);
        Task<CoreResult<TEntity>> SaveEntityAsync(TEntity entity, int entityId);
    }
}
