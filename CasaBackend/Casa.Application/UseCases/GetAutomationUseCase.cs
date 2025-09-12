using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class GetAutomationUseCase<TEntity, TView>(
        IAutomationRepository<TEntity> repository,
        IPresenter<TEntity, TView> presenter)
    {
        private readonly IAutomationRepository<TEntity> _repository = repository;
        private readonly IPresenter<TEntity, TView> _presenter = presenter;

        public async Task<CoreResult<TView>> ExecuteAsync(int id)
        {
            var result = await _repository.GetByAutomationIdAsync(id);
            return result.IsSuccess
                ? CoreResult<TView>.Success(_presenter.Present(result.Data))
                : CoreResult<TView>.Failure(result.Errors);
        }
        public async Task<CoreResult<IEnumerable<TView>>> ExecuteAsync()
        {
            var result = await _repository.GetAllAutomationsAsync();
            IEnumerable<TView> views = [];
            return result.IsSuccess
                ? CoreResult<IEnumerable<TView>>.Success(result.Data.Select(_presenter.Present).ToList())
                : CoreResult<IEnumerable<TView>>.Failure(result.Errors);
        }
    }
}