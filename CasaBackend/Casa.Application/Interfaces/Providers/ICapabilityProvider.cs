using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;

namespace CasaBackend.Casa.Application.Interfaces.Providers
{
    public interface ICapabilityProvider
    {
        Task<ICapabilityModel?> GetByDeviceIdAsync(int deviceId);
        Task<Dictionary<int, ICapabilityModel>> GetAllAsync();
    }
}
