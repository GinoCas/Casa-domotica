using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.Interfaces.Services
{
	public interface IArduinoService<TDTO>
	{
		public Task<CoreResult<bool>> ConnectAsync();
		public Task<CoreResult<bool>> PublishAsync(TDTO data);
		public Task<CoreResult<IEnumerable<TDTO>>> GetAllAsync();
	}
}
