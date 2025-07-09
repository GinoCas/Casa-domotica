using AutoMapper;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Application.Factories;

namespace CasaBackend.Casa.Application.Services
{
    public class CommandService : ICommandService
    {
        private readonly IMapper _mapper;
        private readonly CommandFactory _commandFactory;
        private readonly IRepository<DeviceEntity> _deviceRepository;

        public CommandService(IMapper mapper, CommandFactory commandFactory, IRepository<DeviceEntity> deviceRepository)
        {
            _mapper = mapper;
            _commandFactory = commandFactory;
            _deviceRepository = deviceRepository;
        }

        public async Task<CoreResult<bool>> ExecuteAsync(CommandEntity entity)
        {
            var handler = _commandFactory.GetCommand(entity.CommandName);
            await handler.HandleAsync(entity);
            return new CoreResult<bool>();
        }
    }
}
