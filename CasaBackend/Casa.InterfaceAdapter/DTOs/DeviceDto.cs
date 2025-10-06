namespace CasaBackend.Casa.InterfaceAdapter.DTOs
{
	public class DeviceDto
	{
		public int Id { get; set; }
		public int ArduinoId { get; set; }
		public bool State { get; set; }
		public string DeviceType { get; set; } = string.Empty;
	}
}
