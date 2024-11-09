using CasaAPI.Interfaces;
using Newtonsoft.Json;

namespace CasaAPI.Arduino
{
	public class ArduinoManager
	{
		private readonly ArduinoConnection arduinoConnection;
		public ArduinoManager(ArduinoConnection arduinoConnection)
		{
			this.arduinoConnection = arduinoConnection;
			arduinoConnection.Open();
			Thread thread = new Thread(SerialHear);
			thread.Start();
			
		}
		public void UpdateDevice(IDevice device)
		{
			string deviceJson = JsonConvert.SerializeObject(device);
			Console.WriteLine(deviceJson);
			arduinoConnection.Port.WriteLine(deviceJson);
		}
		public void SerialHear()
		{
			while (arduinoConnection.Port.IsOpen)
			{
				try
				{
					string cadena = arduinoConnection.Port.ReadLine();
					Console.WriteLine(cadena);
				}
				catch
				{

				}
			}
		}
	}
}
