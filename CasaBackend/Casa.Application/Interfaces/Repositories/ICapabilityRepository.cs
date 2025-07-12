namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface ICapabilityRepository<TEntity>
    {
        Task<TEntity> GetByDeviceIdAsync(int deviceId);
        Task<TEntity> SaveEntityAsync(TEntity entity, int entityId);
    }
}
