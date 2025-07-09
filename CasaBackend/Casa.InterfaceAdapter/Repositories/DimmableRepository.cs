using AutoMapper;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.InterfaceAdapter.Repositories
{
    public class DimmableRepository : ICapabilityRepository<DimmableEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public DimmableRepository(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<DimmableEntity> GetByIdAsync(int id)
        {
            var model = await _dbContext.Dimmables.FindAsync(id);
            return _mapper.Map<DimmableEntity>(model);
        }
        public async Task<DimmableEntity> GetByDeviceIdAsync(int deviceId)
        {
            var model = await _dbContext.Dimmables.FirstOrDefaultAsync(d => d.DeviceId == deviceId);
            return _mapper.Map<DimmableEntity>(model);
        }
        public async Task<IEnumerable<DimmableEntity>> GetAllAsync() { throw new NotImplementedException(); }
        public async Task<DimmableEntity> UpdateAsync(DimmableEntity entity)
        {
            var existingModel = await _dbContext.Dimmables.FindAsync(entity.Id) ?? throw new InvalidOperationException("El dispositivo no existe en la base de datos");
            _mapper.Map(entity, existingModel);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<DimmableEntity>(existingModel);
        }
        public async Task<DimmableEntity> CreateAsync(DimmableEntity device) { throw new NotImplementedException(); }
        public async Task<bool> DeleteAsync(int id) { throw new NotImplementedException(); }
    }
}
