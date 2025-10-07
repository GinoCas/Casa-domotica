using AutoMapper;
using CasaBackend.Casa.InterfaceAdapter.Models;
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
                .Include(r => r.RoomDevices)
                .FirstOrDefaultAsync((room) => room.Name == name);
            if (model == null) return CoreResult<RoomEntity>.Failure([$"La habitación con nombre {name} no fue encontrada."]);
            var entity = _mapper.Map<RoomEntity>(model);
            return CoreResult<RoomEntity>.Success(entity);
        }
        public async Task<CoreResult<IEnumerable<RoomEntity>>> GetAllRoomsAsync()
        {
            var rooms = await _dbContext.Rooms
                .Include(r => r.RoomDevices)
                .ToListAsync();
            if(rooms.Count == 0 || rooms == null) 
            {
                return CoreResult<IEnumerable<RoomEntity>>.Failure(["No se pudieron obtener las habitaciones."]);
            }
            var entities = _mapper.Map<IEnumerable<RoomEntity>>(rooms);
            return CoreResult<IEnumerable<RoomEntity>>.Success(entities);
        }

        public async Task<CoreResult<RoomEntity>> CreateRoomAsync(RoomEntity entity)
        {
            var room = await _dbContext.Rooms.FirstOrDefaultAsync(r => r.Name == entity.Name);
            if (room != null) return CoreResult<RoomEntity>.Failure([$"La habitación con nombre {entity.Name} ya existe."]);

            var model = _mapper.Map<RoomModel>(entity);
            await _dbContext.Rooms.AddAsync(model);
            await _dbContext.SaveChangesAsync();
            var newEntity = _mapper.Map<RoomEntity>(model);
            return CoreResult<RoomEntity>.Success(newEntity);
        }

        public async Task<CoreResult<int>> AddDeviceToRoomAsync(int roomId, int deviceId)
        {
            var room = await _dbContext.Rooms
                 .Include(r => r.RoomDevices)
                 .FirstOrDefaultAsync((room) => room.Id == roomId);
            if (room == null) return CoreResult<int>.Failure([$"La habitación con id {roomId} no fue encontrada."]);
            if (room.RoomDevices.FirstOrDefault((rd) => rd.DeviceId == deviceId) != null)
                return CoreResult<int>.Failure([$"La habitación con id {roomId} ya contiene el dispositivo con id {deviceId}."]);
            var device = await _dbContext.Devices.FindAsync(deviceId);
            if (device == null) return CoreResult<int>.Failure([$"El dispositivo con id {deviceId} no fue encontrado."]);
            var deviceInRoom = await _dbContext.RoomDevices
                .Where(rd => rd.DeviceId == deviceId && rd.RoomId != roomId)
                .ToListAsync();
            if (deviceInRoom.Count != 0)
            {
                _dbContext.RoomDevices.RemoveRange(deviceInRoom);
            }
            var roomDevice = new RoomDeviceModel { RoomId = roomId, DeviceId = deviceId };
            await _dbContext.RoomDevices.AddAsync(roomDevice);
            await _dbContext.SaveChangesAsync();
            return CoreResult<int>.Success(deviceId);
        }
    }
}
