using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class EraseAutomationUseCase<TEntity>(IAutomationRepository<TEntity> repository)
    {
        private readonly IAutomationRepository<TEntity> _repository = repository;

        public async Task<CoreResult<bool>> ExecuteAsync(int id)
        {
            var result = await _repository.DeleteAutomationAsync(id);
            return result.IsSuccess 
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(result.Errors);
        }
    }
}