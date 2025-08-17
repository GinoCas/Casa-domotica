using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
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
        private readonly IMapper _mapper;
        public DeviceRepository(AppDbContext dbContext, IFactory<DeviceEntity, DeviceContextDto> factory, CapabilityService capabilityService, IMapper mapper)
        {
            _dbContext = dbContext;
            _deviceFactory = factory;
            _capabilityService = capabilityService;
            _mapper = mapper;
        }
        public async Task<CoreResult<DeviceEntity>> GetByIdAsync(int id)
        {
            var model = await _dbContext.Devices.FindAsync(id);
            if (model is null) return CoreResult<DeviceEntity>.Failure([$"El dispositivo con id {id} no se encontro."]);
            var capabilities = await _capabilityService.GetCapabilitiesForDeviceAsync(id);
            var dto = new DeviceContextDto { DeviceModel = model, Capabilities = capabilities };
            var fabricResult = _deviceFactory.Fabric(dto);
            return fabricResult.IsSuccess
                ? CoreResult<DeviceEntity>.Success(fabricResult.Data)
                : CoreResult<DeviceEntity>.Failure(fabricResult.Errors);
        }
        public async Task<CoreResult<IEnumerable<DeviceEntity>>> GetAllAsync()
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
                entities.Add(_deviceFactory.Fabric(dto).Data);
            }
            return CoreResult<IEnumerable<DeviceEntity>>.Success(entities);
        }
        public async Task<CoreResult<DeviceEntity>> UpdateAsync(DeviceEntity device)
        {
            var existingModel = await _dbContext.Devices.FindAsync(device.Id);
            if (existingModel is null) return CoreResult<DeviceEntity>.Failure([$"El dispositivo con id {device.Id} no se encontró."]);
            _mapper.Map(device, existingModel);
            await _dbContext.SaveChangesAsync();

            var capabilities = await _capabilityService.GetCapabilitiesForDeviceAsync(device.Id);
            var dto = new DeviceContextDto { DeviceModel = existingModel, Capabilities = capabilities };
            var result = _deviceFactory.Fabric(dto);
            return result.IsSuccess
                ? CoreResult<DeviceEntity>.Success(result.Data)
                : CoreResult<DeviceEntity>.Failure(result.Errors);
        }
        public async Task<CoreResult<DeviceEntity>> CreateAsync(DeviceEntity device) {  throw new NotImplementedException(); }
        public async Task<CoreResult<bool>> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
