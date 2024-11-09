using CasaAPI.Dto;

namespace CasaAPI.Interfaces
{
    public interface IDeviceDto
    {
        public string deviceType { get; set; }
		public DeviceBaseProperties baseProperties { get; set; }
    }
}
