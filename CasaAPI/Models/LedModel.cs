namespace CasaAPI.Models
{
	public class LedModel
	{
		int Id { get; set; }
		int Pin {  get; set; }
		bool State { get; set; }
		int Brightness { get; set; }
		double Voltage { get; set; } // Volts
		double Energy { get; set; } // Amperes
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
