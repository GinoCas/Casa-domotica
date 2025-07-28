using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure.Repositories
{
    public class RoomRepository : IRoomRepository<RoomEntity>
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public RoomRepository(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<CoreResult<RoomEntity>> GetByRoomNameAsync(string name)
        {
            var model = await _dbContext.Rooms
                .FirstOrDefaultAsync((room) => room.Name == name);
            if (model == null) return CoreResult<RoomEntity>.Failure([$"La habitación con nombre {name} no fue encontrada."]);
            var entity = _mapper.Map<RoomEntity>(model);
            return CoreResult<RoomEntity>.Success(entity);
        }
        public async Task<CoreResult<IEnumerable<string>>> GetAllRoomNamesAsync()
        {
            var roomNames = await _dbContext.Rooms
                .Select((room) => room.Name)
                .ToListAsync();
            if(roomNames.Count == 0 || roomNames == null) 
            {
                return CoreResult<IEnumerable<string>>.Failure(["No se pudieron obtener los nombres de las habitaciones."]);
            } 
            return CoreResult<IEnumerable<string>>.Success(roomNames);
        }
    }
}
