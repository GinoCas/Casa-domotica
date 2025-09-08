using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.Application.UseCases
{
    public class EditAutomationUseCase<TEntity, TDTO>(IRepository<TEntity> repository, IMapper mapper)
    {
        private readonly IRepository<TEntity> _repository = repository;
        private readonly IMapper _mapper = mapper;

        public async Task<CoreResult<bool>> ExecuteAsync(int id, TDTO dto)
        {
            var existingEntityResult = await _repository.GetByIdAsync(id);
            if (!existingEntityResult.IsSuccess) return CoreResult<bool>.Failure(existingEntityResult.Errors);
            var entity = _mapper.Map(dto, existingEntityResult.Data);
            var result = await _repository.UpdateAsync(entity);
            return result.IsSuccess 
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(result.Errors);
        }
    }
}