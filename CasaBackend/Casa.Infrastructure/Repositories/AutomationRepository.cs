using AutoMapper;
using Casa.Core.Entities;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Infrastructure;
using CasaBackend.Casa.InterfaceAdapter.Models;
using Microsoft.EntityFrameworkCore;

namespace Casa.Infrastructure.Repositories
{
    public class AutomationRepository : IRepository<AutomationEntity>
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AutomationRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CoreResult<AutomationEntity>> CreateAsync(AutomationEntity entity)
        {
            var model = _mapper.Map<AutomationModel>(entity);
            await _context.Automations.AddAsync(model);
            await _context.SaveChangesAsync();
            return CoreResult<AutomationEntity>.Success(_mapper.Map<AutomationEntity>(model));
        }

        public async Task<CoreResult<bool>> DeleteAsync(int id)
        {
            var model = await _context.Automations.FindAsync(id);
            if (model == null)
            {
                return CoreResult<bool>.Failure(["Automatizaci�n no encontrada."]);
            }
            _context.Automations.Remove(model);
            await _context.SaveChangesAsync();
            return CoreResult<bool>.Success(true);
        }

        public async Task<CoreResult<IEnumerable<AutomationEntity>>> GetAllAsync()
        {
            var models = await _context.Automations.Include(a => a.Devices).ToListAsync();
            var entities = _mapper.Map<IEnumerable<AutomationEntity>>(models);
            return CoreResult<IEnumerable<AutomationEntity>>.Success(entities);
        }

        public async Task<CoreResult<AutomationEntity>> GetByIdAsync(int id)
        {
            var model = await _context.Automations.Include(a => a.Devices).FirstOrDefaultAsync(a => a.Id == id);
            if (model == null)
            {
                return CoreResult<AutomationEntity>.Failure(["Automatizaci�n no encontrada."]);
            }
            var entity = _mapper.Map<AutomationEntity>(model);
            return CoreResult<AutomationEntity>.Success(entity);
        }

        public async Task<CoreResult<AutomationEntity>> UpdateAsync(AutomationEntity entity)
        {
            var model = await _context.Automations.FindAsync(entity.Id);
            if (model == null)
            {
                return CoreResult<AutomationEntity>.Failure(["Automatizaci�n no encontrada."]);
            }
            _mapper.Map(entity, model);
            await _context.SaveChangesAsync();
            return CoreResult<AutomationEntity>.Success(_mapper.Map<AutomationEntity>(model));
        }
    }
}