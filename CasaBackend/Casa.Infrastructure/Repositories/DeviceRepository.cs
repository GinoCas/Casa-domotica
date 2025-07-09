using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Infrastructure;
using CasaBackend.Casa.Infrastructure.Factories;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class DeviceRepository : IRepository<DeviceEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly CapabilityFactory _deviceFactory;
        private readonly IMapper _mapper;
        public DeviceRepository(AppDbContext dbContext, IMapper mapper, CapabilityFactory deviceFactory)
        {
            _dbContext = dbContext;
            _deviceFactory = deviceFactory;
            _mapper = mapper;
        }
        public async Task<DeviceEntity> GetByIdAsync(int id)
        {
            var model = await _dbContext.Devices.FindAsync(id);
            return await _deviceFactory.CreateAsync(model);
        }
        public async Task<DeviceEntity> UpdateAsync(DeviceEntity device) { throw new NotImplementedException(); }
        public async Task<IEnumerable<DeviceEntity>> GetAllAsync() {  throw new NotImplementedException(); }
        public async Task<DeviceEntity> CreateAsync(DeviceEntity device) {  throw new NotImplementedException(); }
        public async Task<bool> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
