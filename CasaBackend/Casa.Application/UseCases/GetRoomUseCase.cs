using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class GetRoomUseCase<TEntity>
        (
        IRoomRepository<TEntity> repository
        )
    {
        private readonly IRoomRepository<TEntity> _repository = repository;
        public async Task<CoreResult<TEntity>> ExecuteAsync(string name)
        {
            var result = await _repository.GetByRoomNameAsync(name);
            return result.IsSuccess
                ? CoreResult<TEntity>.Success(result.Data)
                : CoreResult<TEntity>.Failure(result.Errors);
        }
        public async Task<CoreResult<IEnumerable<TEntity>>> ExecuteAsync()
        {
            var result = await _repository.GetAllRoomsAsync();
            return result.IsSuccess
                ? CoreResult<IEnumerable<TEntity>>.Success(result.Data)
                : CoreResult<IEnumerable<TEntity>>.Failure(result.Errors);
        }
    }
}
