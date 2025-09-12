using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class CreateAutomationUseCase<TEntity, TDTO>(IAutomationRepository<TEntity> repository, IMapper mapper)
    {
        private readonly IAutomationRepository<TEntity> _repository = repository;
        private readonly IMapper _mapper = mapper;

        public async Task<CoreResult<TEntity>> ExecuteAsync(TDTO dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            var result = await _repository.CreateAutomationAsync(entity);
            return result.IsSuccess 
                ? CoreResult<TEntity>.Success(result.Data)
                : CoreResult<TEntity>.Failure(result.Errors);
        }
    }
}