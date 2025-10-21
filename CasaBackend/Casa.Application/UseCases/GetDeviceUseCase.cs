using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CasaBackend.Casa.Application.UseCases
{
    public class GetDeviceUseCase<TEntity, TView>
        (
        IDeviceRepository<TEntity> repository,
        IPresenter<TEntity, TView> presenter
        )
    {
        private readonly IDeviceRepository<TEntity> _repository = repository;
        private readonly IPresenter<TEntity, TView> _presenter = presenter;
        public async Task<CoreResult<TView>> ExecuteAsync(int id)
        {
            var result = await _repository.GetByDeviceIdAsync(id);
            return result.IsSuccess
                ? CoreResult<TView>.Success(_presenter.Present(result.Data))
                : CoreResult<TView>.Failure(result.Errors);
        }
        public async Task<CoreResult<IEnumerable<TView>>> ExecuteAsync()
        {
            var result = await _repository.GetAllDevicesAsync();
            IEnumerable<TView> views = [];
            return result.IsSuccess
                ? CoreResult<IEnumerable<TView>>.Success(result.Data.Select(_presenter.Present).ToList())
                : CoreResult<IEnumerable<TView>>.Failure(result.Errors);
        }
        public async Task<CoreResult<IEnumerable<TView>>> ExecuteModifiedAfterAsync(DateTime dateUtc)
        {
            var result = await _repository.GetDevicesModifiedAfterAsync(dateUtc);
            return result.IsSuccess
                ? CoreResult<IEnumerable<TView>>.Success(result.Data.Select(_presenter.Present).ToList())
                : CoreResult<IEnumerable<TView>>.Failure(result.Errors);
        }
    }
}
