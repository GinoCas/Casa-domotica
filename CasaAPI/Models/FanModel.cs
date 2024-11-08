using CasaAPI.Interfaces;

namespace CasaAPI.Models
{
	public class FanModel : IDevice
	{
		public string deviceType { get; set; }
		public int id { get; set; }
		public int pin { get; set; }
		public bool state { get; set; }
		public double voltage { get; set; }
		public double amperes { get; set; }
		public int speed { get; set; }
		public FanModel()
		{
			deviceType = "Fan";
		}
	}
}
