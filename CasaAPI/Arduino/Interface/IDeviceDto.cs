namespace CasaAPI.Arduino.Interface
{
	public interface IDeviceDto : CasaAPI.Interfaces.IDevice
	{
		public int mode { get; set; } // 0 = OUTPUT 1 = INPUT
	}
}
