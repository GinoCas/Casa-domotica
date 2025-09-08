using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class EraseAutomationUseCase<TEntity>(IRepository<TEntity> repository)
    {
        private readonly IRepository<TEntity> _repository = repository;

        public async Task<CoreResult<bool>> ExecuteAsync(int id)
        {
            var result = await _repository.DeleteAsync(id);
            return result.IsSuccess 
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(result.Errors);
        }
    }
}