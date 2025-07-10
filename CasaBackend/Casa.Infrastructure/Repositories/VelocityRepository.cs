using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities.Capabilities;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class VelocityRepository : ICapabilityRepository<VelocityEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public VelocityRepository(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<VelocityEntity> GetByIdAsync(int id)
        {
            var model = await _dbContext.Velocities.FindAsync(id);
            return _mapper.Map<VelocityEntity>(model);
        }
        public async Task<VelocityEntity> GetByDeviceIdAsync(int deviceId)
        {
            var model = await _dbContext.Velocities.FirstOrDefaultAsync(d => d.DeviceId == deviceId);
            return _mapper.Map<VelocityEntity>(model);
        }
        public async Task<IEnumerable<VelocityEntity>> GetAllAsync() { throw new NotImplementedException(); }
        public async Task<VelocityEntity> UpdateAsync(VelocityEntity entity)
        {
            var existingModel = await _dbContext.Velocities.FindAsync(entity.Id) ?? throw new InvalidOperationException("El dispositivo no existe en la base de datos");
            _mapper.Map(entity, existingModel);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<VelocityEntity>(existingModel);
        }
        public async Task<VelocityEntity> CreateAsync(VelocityEntity device) { throw new NotImplementedException(); }
        public async Task<bool> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
