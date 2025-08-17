using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.Application.UseCases
{
    public class DoDeviceCommandUseCase<TDTO>(IMapper mapper, IFactory<ICommandHandler, string> commandFactory)
    {
        private readonly IFactory<ICommandHandler, string> _commandFactory = commandFactory;
        private readonly IMapper _mapper = mapper;

        public async Task<CoreResult<bool>> ExecuteAsync(TDTO dto)
        {
            var entity = _mapper.Map<CommandEntity>(dto);
            var factoryResult = _commandFactory.Fabric(entity.CommandName);
            if (!factoryResult.IsSuccess) return CoreResult<bool>.Failure(factoryResult.Errors);
            var handlerResult = await factoryResult.Data.HandleAsync(entity);
            if (!handlerResult.IsSuccess) return CoreResult<bool>.Failure(handlerResult.Errors);
            return CoreResult<bool>.Success(true);
        }
    }
}
