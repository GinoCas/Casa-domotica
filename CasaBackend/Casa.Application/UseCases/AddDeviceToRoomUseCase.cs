using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using System.Linq;
using System.Security.Cryptography;

namespace CasaBackend.Casa.Application.UseCases
{
    public class AddDeviceToRoomUseCase<TEntity>(IRoomRepository<TEntity> repository)
    {
        private readonly IRoomRepository<TEntity> _repository = repository;

        public async Task<CoreResult<int>> ExecuteAsync(int roomId, int deviceId)
        {
            var result = await _repository.AddDeviceToRoomAsync(roomId, deviceId);
            
            return result.IsSuccess 
                ? CoreResult<int>.Success(result.Data)
                : CoreResult<int>.Failure(result.Errors);
        }
    }
}