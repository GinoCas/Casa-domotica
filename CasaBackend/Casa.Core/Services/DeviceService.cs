using CasaBackend.Casa.Core.Interfaces;
using CasaBackend.Casa.Core.Models;

namespace CasaBackend.Casa.Core.Services
{
    public class DeviceService : IService<Device, CoreResult<Device>>
	{
		public Task<CoreResult<Device>> GetAll()
		{
			return Task.FromResult(new CoreResult<Device>());
		}
		public Task<CoreResult<Device>> GetByIdAsync(int id)
		{
			return Task.FromResult(new CoreResult<Device>();
		}
		public Task<CoreResult<Device>> AddAsync(Device device)
		{
			return Task.FromResult(new CoreResult<Device>();
		}
		public Task<CoreResult<Device>> UpdateAsync(Device device)
		{
			return Task.FromResult(new CoreResult<Device>();
		}
		public Task<CoreResult<Device>> DeleteAsync(int id)
		{
			return Task.FromResult(new CoreResult<Device>();
		}
	}
}
