namespace CasaAPI.Models
{
	public class LedModel
	{
		public int Id { get; set; }
		public int Pin {  get; set; }
		public bool State { get; set; }
		public int Brightness { get; set; }
		public double Voltage { get; set; } // Volts
		public double Energy { get; set; } // Amperes
		public LedModel(int id, int pin, bool state, int brightness, double voltage, double energy)
		{
			Id = id;
			Pin = pin;
			State = state;
			Brightness = brightness;
			Voltage = voltage;
			Energy = energy;
		}
	}
}
