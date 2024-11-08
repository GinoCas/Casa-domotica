namespace CasaAPI.Arduino
{
	public class ArduinoManager
	{
		private readonly ArduinoConnection arduinoConnection;
		public ArduinoManager(ArduinoConnection arduinoConnection)
		{
			this.arduinoConnection = arduinoConnection;
		}
		public void LedOn()
		{
			arduinoConnection.Open();
			arduinoConnection.Write("on\n");
			arduinoConnection.Close();
		}
		public void LedOff()
		{
			arduinoConnection.Open();
			arduinoConnection.Write("off\n");
			arduinoConnection.Close();
		}
	}
}
