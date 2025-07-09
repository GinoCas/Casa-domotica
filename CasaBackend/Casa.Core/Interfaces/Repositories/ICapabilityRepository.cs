namespace CasaBackend.Casa.Core.Interfaces.Repositories
{
    public interface ICapabilityRepository<T> : IRepository<T>
    {
        Task<T> GetByDeviceIdAsync(int deviceId);
    }
}
