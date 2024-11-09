using CasaAPI.Interfaces;

namespace CasaAPI.Dto
{
    public class LedDto : IDeviceDto
	{
		public string deviceType { get; set; }
		public DeviceBaseProperties baseProperties { get; set; }
		public int brightness { get; set; }
		public LedDto()
		{
			deviceType = "Led";
			baseProperties = new DeviceBaseProperties();
		}
	}
}
