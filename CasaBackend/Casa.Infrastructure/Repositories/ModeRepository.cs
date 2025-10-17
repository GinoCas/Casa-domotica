using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Infrastructure;
using CasaBackend.Casa.InterfaceAdapter.Models;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class ModeRepository : IModeRepository<ModeEntity>
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ModeRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CoreResult<IEnumerable<ModeEntity>>> GetAllModesAsync()
        {
            var models = await _context.Modes.ToListAsync();
            var entities = _mapper.Map<IEnumerable<ModeEntity>>(models);
            return CoreResult<IEnumerable<ModeEntity>>.Success(entities);
        }

        public async Task<CoreResult<ModeEntity>> GetByNameAsync(string name)
        {
            var model = await _context.Modes.FirstOrDefaultAsync(m => m.Name == name);
            if (model == null)
            {
                return CoreResult<ModeEntity>.Failure(["Modo no encontrado."]);
            }
            return CoreResult<ModeEntity>.Success(_mapper.Map<ModeEntity>(model));
        }

        public async Task<CoreResult<ModeEntity>> CreateModeAsync(ModeEntity entity)
        {
            var model = _mapper.Map<ModeModel>(entity);
            await _context.Modes.AddAsync(model);
            await _context.SaveChangesAsync();
            return CoreResult<ModeEntity>.Success(_mapper.Map<ModeEntity>(model));
        }

        public async Task<CoreResult<ModeEntity>> UpdateModeAsync(ModeEntity entity)
        {
            var model = await _context.Modes.FirstOrDefaultAsync(m => m.Id == entity.Id);
            if (model == null)
            {
                return CoreResult<ModeEntity>.Failure(["Modo no encontrado."]);
            }
            _mapper.Map(entity, model);
            await _context.SaveChangesAsync();
            return CoreResult<ModeEntity>.Success(_mapper.Map<ModeEntity>(model));
        }
    }
}