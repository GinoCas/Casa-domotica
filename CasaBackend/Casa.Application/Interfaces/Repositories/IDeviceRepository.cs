using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.Application.Interfaces.Repositories
{
    public interface IDeviceRepository<TEntity>
    {
        Task<CoreResult<TEntity>> GetByDeviceIdAsync(int id);
        Task<CoreResult<TEntity>> GetByArduinoIdAsync(int arduinoId);
        Task<CoreResult<IEnumerable<TEntity>>> GetAllDevicesAsync();
        Task<CoreResult<TEntity>> UpdateDeviceAsync(TEntity entity);
        Task<CoreResult<TEntity>> AddDeviceAsync(TEntity entity);
    }
}
