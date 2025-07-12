using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Infrastructure.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class DeviceRepository : IRepository<DeviceEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly IFactory<DeviceEntity, DeviceContextDto> _deviceFactory;
        private readonly CapabilityService _capabilityService;
        public DeviceRepository(AppDbContext dbContext, IFactory<DeviceEntity, DeviceContextDto> factory, CapabilityService capabilityService)
        {
            _dbContext = dbContext;
            _deviceFactory = factory;
            _capabilityService = capabilityService;
        }
        public async Task<DeviceEntity> GetByIdAsync(int id)
        {
            var model = await _dbContext.Devices.FindAsync(id);
            var capabilities = await _capabilityService.GetCapabilitiesForDeviceAsync(id);
            var dto = new DeviceContextDto { DeviceModel = model, Capabilities = capabilities };
            return model == null
                ? throw new InvalidOperationException($"El dispositivo con id {id} no se encontro.")
                : _deviceFactory.Fabric(dto);
        }
        public async Task<IEnumerable<DeviceEntity>> GetAllAsync()
        {
            var models = await _dbContext.Devices.ToListAsync();
            var capabilities = await _capabilityService.GetAllCapabilitiesAsync();
            var entities = new List<DeviceEntity>();
            foreach (var model in models)
            {
                var dto = new DeviceContextDto
                {
                    DeviceModel = model,
                    Capabilities = capabilities.ContainsKey(model.Id) ? capabilities[model.Id] : []
                };
                entities.Add(_deviceFactory.Fabric(dto));
            }
            return entities;
        }
        public async Task<DeviceEntity> UpdateAsync(DeviceEntity device) { throw new NotImplementedException(); }
        public async Task<DeviceEntity> CreateAsync(DeviceEntity device) {  throw new NotImplementedException(); }
        public async Task<bool> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
