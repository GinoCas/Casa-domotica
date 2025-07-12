using AutoMapper;
using CasaBackend.Casa.Application.Factories;
using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.Application.UseCases
{
    public class DoDeviceCommandUseCase<TDTO>(IMapper mapper, IFactory<ICommandHandler, string> commandFactory)
    {
        private readonly IFactory<ICommandHandler, string> _commandFactory = commandFactory;
        private readonly IMapper _mapper = mapper;

        public async Task<bool> ExecuteAsync(TDTO dto)
        {
            var entity = _mapper.Map<CommandEntity>(dto);

            if(entity.DeviceId > 13 || entity.DeviceId < 0)
            {
                throw new Exception($"El id {entity.DeviceId} es incorrecto.");
            }
            if(entity.CommandName == null || entity.CommandName == string.Empty)
            {
                throw new Exception($"El comando que se quiere ejecutar es nulo/esta vacio.");
            }
            var handler = _commandFactory.Fabric(entity.CommandName);
            await handler.HandleAsync(entity);
            return true;
        }
    }
}
