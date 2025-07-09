using AutoMapper;
using Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.API.DTOs;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.InterfaceAdapter;
using CasaBackend.Casa.InterfaceAdapter.Models;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class DeviceRepository : IRepository<DeviceEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly DeviceFactory _deviceFactory;
        public DeviceRepository(AppDbContext dbContext, IMapper mapper, DeviceFactory deviceFactory)
        {
            _dbContext = dbContext;
            _deviceFactory = deviceFactory;
        }
        public async Task<DeviceEntity> GetByIdAsync(int id)
        {
            var device = await _dbContext.Devices.FindAsync(id);
            return await _deviceFactory.CreateAsync(device);
        }
        public async Task<DeviceEntity> UpdateAsync(DeviceEntity device) { throw new NotImplementedException(); }
        public async Task<IEnumerable<DeviceEntity>> GetAllAsync() {  throw new NotImplementedException(); }
        public async Task<DeviceEntity> CreateAsync(DeviceEntity device) {  throw new NotImplementedException(); }
        public async Task<bool> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
