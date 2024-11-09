using CasaAPI.Dto;
using CasaAPI.Handlers.Device;
using CasaAPI.Interfaces;
using CasaAPI.Models;

namespace CasaAPI.Factories
{
	public class DeviceFactory
	{
		public readonly Dictionary<string, Func<dynamic, IDevice>> factory;
		private static IDevice MapBaseProperties(dynamic device, IDevice model)
		{
			model.id = (int)device.baseProperties.id;
			model.state = (bool)device.baseProperties.state;
			model.pin = (int?)device.baseProperties.pin;
			return model;
		}
		public DeviceFactory()
		{
			factory = new Dictionary<string, Func<dynamic, IDevice>>
			{
				{ "Led", device =>
					{
						LedModel led = MapBaseProperties(device, new LedModel());
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
