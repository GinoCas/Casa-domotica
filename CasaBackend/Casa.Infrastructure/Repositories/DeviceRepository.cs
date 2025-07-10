using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.InterfaceAdapter.Models;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class DeviceRepository : IRepository<DeviceEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        IDeviceFactory<DeviceEntity, DeviceModel> _deviceFactory;
        public DeviceRepository(AppDbContext dbContext, IMapper mapper, IDeviceFactory<DeviceEntity, DeviceModel> factory)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _deviceFactory = factory;
        }
        public async Task<DeviceEntity> GetByIdAsync(int id)
        {
            var model = await _dbContext.Devices.FindAsync(id);
            return model == null
                ? throw new InvalidOperationException($"El dispositivo con id {id} no se encontro.")
                : await _deviceFactory.FabricDeviceAsync(model);
        }
        public async Task<IEnumerable<DeviceEntity>> GetAllAsync()
        {
            var models = await _dbContext.Devices.ToListAsync();

            var results = new List<DeviceEntity>();
            foreach (var model in models)
            {
                var entity = await _deviceFactory.FabricDeviceAsync(model);
                results.Add(entity);
            }
            return results;
        }
        public async Task<DeviceEntity> UpdateAsync(DeviceEntity device) { throw new NotImplementedException(); }
        public async Task<DeviceEntity> CreateAsync(DeviceEntity device) {  throw new NotImplementedException(); }
        public async Task<bool> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
