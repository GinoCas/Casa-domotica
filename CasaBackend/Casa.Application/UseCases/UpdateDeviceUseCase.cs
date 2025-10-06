using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class UpdateDeviceUseCase<TEntity, TDTO, TView>
    (
        IDeviceRepository<TEntity> repository,
        IPresenter<TEntity, TView> presenter,
        IMapper mapper
    )
    {
        private readonly IDeviceRepository<TEntity> _repository = repository;
        private readonly IPresenter<TEntity, TView> _presenter = presenter;
        private readonly IMapper _mapper = mapper;

        public async Task<CoreResult<TView>> ExecuteAsync(int id, TDTO dto)
        {
            var entity = await _repository.GetByDeviceIdAsync(id);
            if (!entity.IsSuccess)
                return CoreResult<TView>.Failure(entity.Errors);

            _mapper.Map(dto, entity.Data);

            var result = await _repository.UpdateDeviceAsync(entity.Data);
            return result.IsSuccess
                ? CoreResult<TView>.Success(_presenter.Present(result.Data))
                : CoreResult<TView>.Failure(result.Errors);
        }
    }
}
