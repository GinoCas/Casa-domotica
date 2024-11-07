using CasaAPI.Interfaces;

namespace CasaAPI.Models
{
    public class LedModel : IDevice
    {
        public int id { get; set; }
        public int pin { get; set; }
        public bool state { get; set; }
        public double voltage { get; set; }
        public double amperes { get; set; }
		public int brightness { get; set; }
    }
}
