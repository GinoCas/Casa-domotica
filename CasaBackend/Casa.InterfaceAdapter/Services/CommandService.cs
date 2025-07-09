using AutoMapper;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Core.Interfaces.Services;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.InterfaceAdapter.DTOs;

namespace CasaBackend.Casa.InterfaceAdapter.Services
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

        public async Task<CoreResult<bool>> ExecuteAsync(CommandDto dto)
        {
            var command = _mapper.Map<CommandEntity>(dto);
            var deviceModel = await _deviceRepository.GetByIdAsync(dto.DeviceId);
            command.Device = _mapper.Map<DeviceEntity>(deviceModel);
            var handler = _commandFactory.GetCommand(command.CommandName);
            await handler.HandleAsync(command);
            return new CoreResult<bool>();
        }
    }
}
