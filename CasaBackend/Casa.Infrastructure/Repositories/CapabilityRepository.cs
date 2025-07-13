using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class CapabilityRepository<TEntity, TModel> : ICapabilityRepository<TEntity>
        where TEntity : class, ICapabilityEntity<TEntity>
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

        public async Task<CoreResult<TEntity>> GetByDeviceIdAsync(int deviceId)
        {
            var model = await _dbSet.FirstOrDefaultAsync(m => m.DeviceId == deviceId);
            if (model is null) return CoreResult<TEntity>.Failure([$"El dispositivo con id {deviceId} no existe en la base de datos."]);
            return CoreResult<TEntity>.Success(_mapper.Map<TEntity>(model));
        }

        public async Task<CoreResult<TEntity>> SaveEntityAsync(TEntity entity, int entityId)
        {
            var model = await _dbSet.FindAsync(entityId);
            if(model is null) return CoreResult<TEntity>.Failure([$"El dispositivo con id {entityId} no existe en la base de datos."]);
            _mapper.Map(entity, model);
            await _dbContext.SaveChangesAsync();
            return CoreResult<TEntity>.Success(_mapper.Map<TEntity>(model));
        }
    }
}
