using CasaAPI.Casa.API.DTOs;
using CasaAPI.Casa.Core.Interfaces;
using CasaAPI.Casa.Core.Models;

namespace CasaBackend.Casa.Core.Services
{
    public class DeviceService : IService<Device, DeviceDto>
	{
		public Task<List<Device>> GetAll()
		{
			return Task.FromResult(new List<Device>());
		}
		public Task<DeviceDto?> GetByIdAsync(int id)
		{
			return Task.FromResult(new DeviceDto());
		}
		public Task<bool> AddAsync(Device device)
		{
			return Task.FromResult(false);
		}
		public Task<bool> UpdateAsync(Device device)
		{
			return Task.FromResult(false);
		}
		public Task<bool> DeleteAsync(int id)
		{
			return Task.FromResult(false);
		}
	}
}
