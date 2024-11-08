using CasaAPI.Dto;
using CasaAPI.Interfaces;

namespace CasaAPI.Factories
{
    public class DeviceDtoFactory
	{
		public readonly Dictionary<string, Func<dynamic, IDeviceDto>> factory;
		public DeviceDtoFactory()
		{
			factory = new Dictionary<string, Func<dynamic, IDeviceDto>>
			{
				{ "Led", device =>
					{
						LedDto dto = new LedDto();
						dto.baseProperties.id = device.id;
						dto.baseProperties.state = device.state;
						dto.baseProperties.voltage = device.voltage;
						dto.baseProperties.amperes = device.amperes;
						dto.brightness = (int)device.brightness;
						return dto;
					}
				},
				{ "Fan", device =>
					{
						FanDto dto = new FanDto();
						dto.speed = (int)device.speed;
						return dto;
					}
				}
			};
		}
	}
}

