using CasaAPI.Arduino.Interface;

namespace CasaAPI.Arduino.Dto
{
	public class LedDto : IDeviceDto
	{
		public string deviceType { get; set; }
		public int id { get; set; }
		public int? pin { get; set; }
		public int mode { get; set; }
		public bool state { get; set; }
		public int brightness { get; set; }
		public LedDto()
		{
			deviceType = "Led";
			mode = 0;
		}
	}
}
