using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class RoomController
        (
            ILogger<RoomController> logger,
            GetRoomUseCase<RoomEntity> getUseCase,
            CreateRoomUseCase<RoomEntity, CreateRoomDto> createRoomUseCase,
            AddDeviceToRoomUseCase<RoomEntity> addDeviceToRoomUseCase
        ) : ControllerBase
    {
        private readonly ILogger<RoomController> _logger = logger;
        private readonly CreateRoomUseCase<RoomEntity, CreateRoomDto> _createRoomUseCase = createRoomUseCase;
        private readonly AddDeviceToRoomUseCase<RoomEntity> _addDeviceToRoomUseCase = addDeviceToRoomUseCase;

        [HttpGet("room/list")]
        public async Task<IActionResult> GetRoomList()
        {
            _logger.LogInformation("Obteniendo lista de habitaicones");
            var result = await getUseCase.ExecuteAsync();
            _logger.LogInformation("Lista de habitaciones obtenida correctamente. Total: {Count}", result.Data.Count());
            return Ok(result.ToJson());
        }

        [HttpPost("room/create")]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto createRoomDto)
        {
            var result = await _createRoomUseCase.ExecuteAsync(createRoomDto);
            return result.IsSuccess ? Ok(result.ToJson()) : BadRequest(result.Errors);
        }

        [HttpPost("{roomId}/devices")]
        public async Task<IActionResult> AddDeviceToRoom(int roomId, [FromBody] AddDevicesToRoomDto addDeviceToRoomDto)
        {
            var result = await _addDeviceToRoomUseCase.ExecuteAsync(roomId, addDeviceToRoomDto.DeviceId);
            return result.IsSuccess ? Ok(result.ToJson()) : BadRequest(result.Errors);
        }
    }
}
