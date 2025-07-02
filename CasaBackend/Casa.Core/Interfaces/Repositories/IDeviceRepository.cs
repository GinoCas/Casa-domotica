using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Core.Models;
using CasaBackend.Casa.Core.Models.ValueObjects;

namespace Casa.Core.Interfaces.Repositories
{
    public interface IDeviceRepository : IRepository<Device>
    {
        Task<CoreResult<IEnumerable<Device>>> GetByTypeAsync(DeviceType deviceType);
    }
}