using CasaAPI.Dto;
using CasaAPI.Handlers.Device;
using CasaAPI.Interfaces;
using CasaAPI.Models;

namespace CasaAPI.Factories
{
	public class DeviceFactory
	{
		public readonly Dictionary<string, Func<dynamic, IDevice>> factory;
		{
			model.id = (int)device.baseProperties.id;
			model.state = (bool)device.baseProperties.state;
			return model;
		}
		public DeviceFactory()
		{
			factory = new Dictionary<string, Func<dynamic, IDevice>>
			{
				{ "Led", device =>
					{
						led.brightness = (int)device.brightness;
						return led;
					}
				},
				{ "Fan", device =>
					{
						FanModel fan = MapBaseProperties(device, new LedModel());
						fan.speed = (int)device.speed;
						return fan;
					}
				}
			};
		}
	}
}
