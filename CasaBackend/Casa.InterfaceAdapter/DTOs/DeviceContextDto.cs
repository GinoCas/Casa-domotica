using CasaBackend.Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;

namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
    public class DeviceContextDto
    {
        public DeviceModel DeviceModel { get; set; }
        public IEnumerable<ICapabilityModel> Capabilities = [];
    }
}
