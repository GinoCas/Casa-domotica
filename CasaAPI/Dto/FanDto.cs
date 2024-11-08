using CasaAPI.Interfaces;

namespace CasaAPI.Dto
{
	public class FanDto : IDeviceDto
	{
		public string deviceType { get; set; }
		public DevicePropertiesDto baseProperties { get; set; }
		public int speed { get; set; }
		public FanDto()
		{
			deviceType = "Fan";
			baseProperties = new DevicePropertiesDto();
		}
	}
}
