namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
	public class ArduinoMessageDto<T>
	{
		public IEnumerable<T> Data { get; set; }
	}
	public class ArduinoDeviceDto
	{
		public int Id { get; set; }
		public bool State { get; set; }
	}
}
