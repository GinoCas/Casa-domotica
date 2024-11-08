using System.IO.Ports;
namespace CasaAPI.Arduino
{
	public class ArduinoConnection
	{
		public readonly SerialPort Port;

		public ArduinoConnection()
		{
			Port = new SerialPort();
			Port.PortName = "COM3";
			Port.BaudRate = 9600;
			Port.ReadTimeout = 500;
		}
		public void PortSetup(string name, int baudRate)
		{
			Port.PortName = name;
			Port.BaudRate = baudRate;
		}
		public string Open()
		{
			try
			{
				Port.Open();
				return "OK";
			}
			catch
			{
				return "Arduino Serial Port could'nt be openned";
			}
		}
		public string Close()
		{
			try
			{
				Port.Close();
				return "OK";
			}
			catch
			{
				return "Arduino Serial Port could'nt be closed";
			}
		}
		public string Write(string command)
		{
			try
			{
				Port.Write(command);
				return "OK";
			}
			catch
			{
				return "Command couldn't be written on Arduino. Check if the connection is open";
			}
		}
	}
}
