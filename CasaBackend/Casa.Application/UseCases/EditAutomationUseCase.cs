using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Core;
using Microsoft.AspNetCore.JsonPatch;

namespace CasaBackend.Casa.Application.UseCases
{
    public class EditAutomationUseCase<TEntity, TDTO>
        where TEntity : class
        where TDTO : class
    {
        private readonly IRepository<TEntity> _repository;
        private readonly IMapper _mapper;

        public EditAutomationUseCase(IRepository<TEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CoreResult<bool>> ExecuteAsync(int id, TDTO dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (!entity.IsSuccess)
            {
                return CoreResult<bool>.Failure(entity.Errors);
            }

            _mapper.Map(dto, entity.Data);

            var result = await _repository.UpdateAsync(entity.Data);

            return result.IsSuccess
                ? CoreResult<bool>.Success(true)
                : CoreResult<bool>.Failure(result.Errors);
        }
    }
}