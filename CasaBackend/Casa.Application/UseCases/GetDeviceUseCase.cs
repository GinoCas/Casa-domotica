using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Repositories;

namespace CasaBackend.Casa.Application.UseCases
{
    public class GetDeviceUseCase<TEntity, TView>
        (
        IRepository<TEntity> repository, 
        IPresenter<TEntity, TView> presenter
        )
    {
        private readonly IRepository<TEntity> _repository = repository;
        private readonly IPresenter<TEntity, TView> _presenter = presenter;
        public async Task<TView> ExecuteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _presenter.Present(entity);
        }
        public async Task<IEnumerable<TView>> ExecuteAsync()
        {
            var devices = await _repository.GetAllAsync();
            IEnumerable<TView> views = [];
            return devices.Select(_presenter.Present).ToList();
        }
    }
}
