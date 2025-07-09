namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface ICapabilityRepository<T> : IRepository<T>
    {
        Task<T> GetByDeviceIdAsync(int deviceId);
    }
}
