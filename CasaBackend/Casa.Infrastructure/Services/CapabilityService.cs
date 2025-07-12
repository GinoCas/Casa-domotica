using CasaBackend.Casa.Application.Interfaces.Providers;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;

namespace CasaBackend.Casa.Infrastructure.Services
{
    public class CapabilityService(IEnumerable<ICapabilityProvider> providers)
    {
        private readonly IEnumerable<ICapabilityProvider> _providers = providers;

        public async Task<IEnumerable<ICapabilityModel>> GetCapabilitiesForDeviceAsync(int deviceId)
        {
            var capabilities = new List<ICapabilityModel>();
            foreach (var provider in _providers)
            {
                var capability = await provider.GetByDeviceIdAsync(deviceId);
                if (capability != null) capabilities.Add(capability);
            }
            return capabilities;
        }
        public async Task<Dictionary<int, List<ICapabilityModel>>> GetAllCapabilitiesAsync()
        {
            var result = new Dictionary<int, List<ICapabilityModel>>();
            foreach (var provider in _providers)
            {
                var capabilities = await provider.GetAllAsync();
                foreach (var (deviceId, capability) in capabilities)
                {
                    if (!result.ContainsKey(deviceId)) result[deviceId] = [];
                    result[deviceId].Add(capability);
                }
            }
            return result;
        }
    }
}