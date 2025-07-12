using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class CapabilityRepository<TEntity, TModel> : ICapabilityRepository<TEntity>
        where TEntity : class
        where TModel : class, ICapabilityModel
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly DbSet<TModel> _dbSet;

        public CapabilityRepository(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _dbSet = _dbContext.Set<TModel>();
        }

        public async Task<TEntity> GetByDeviceIdAsync(int deviceId)
        {
            var model = await _dbSet.FirstOrDefaultAsync(m => m.DeviceId == deviceId) ??
                throw new InvalidOperationException("El dispositivo no existe en la base de datos");
            return _mapper.Map<TEntity>(model);
        }

        public virtual async Task<TEntity> SaveEntityAsync(TEntity entity, int entityId)
        {
            var model = await _dbSet.FindAsync(entityId) ??
                throw new InvalidOperationException("El dispositivo no existe en la base de datos");
            _mapper.Map(entity, model);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<TEntity>(model);
        }
    }
}
