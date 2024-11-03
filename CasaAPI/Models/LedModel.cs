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
	}
}
