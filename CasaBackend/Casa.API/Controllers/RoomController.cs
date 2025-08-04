using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaBackend.Casa.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class RoomController
        (
            ILogger<RoomController> logger,
            GetRoomUseCase<RoomEntity> getUseCase
        ) : ControllerBase
    {
        private readonly ILogger<RoomController> _logger = logger;
        [HttpGet("/room/names")]
        public async Task<IActionResult> GetRoomNameList()
        {
            _logger.LogInformation("Obteniendo lista de habitaicones");
            var result = await getUseCase.ExecuteAsync();
            _logger.LogInformation("Lista de habitaciones obtenida correctamente. Total: {Count}", result.Data.Count());
            return Ok(result.ToJson());
        }
        [HttpGet("/room/{name}")]
        public async Task<IActionResult> GetRoomByName(string name)
        {
            _logger.LogInformation("Obteniendo habitacion con nombre: {name}", name);
            var result = await getUseCase.ExecuteAsync(name);
            if (!result.IsSuccess)
            {
                _logger.LogWarning("Habitacion {name} no encontrada: {Errors}",
                    name, string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Habitacion {name} encontrada exitosamente", name);
            return Ok(result.ToJson());
        }
        [HttpGet("/room/{name}/devices")]
        public async Task<IActionResult> GetRoomDeviceIdsByName(string name)
        {
            _logger.LogInformation("Obteniendo habitacion con nombre: {name}", name);
            var room = await getUseCase.ExecuteAsync(name);
            if (!room.IsSuccess)
            {
                _logger.LogWarning("Habitacion {name} no encontrada: {Errors}",
                    name, string.Join(", ", room.Errors));
                return BadRequest(room.ToJson());
            }
            _logger.LogInformation("Habitacion {name} encontrada exitosamente", name);
            if (!room.Data.DevicesId.Any())
            {
                var err = $"Habitacion {name} no contiene dispositivos.";
                _logger.LogWarning(err, name);
                return Ok(CoreResult<IEnumerable<int>>.Failure([err]));
            }
            var result = CoreResult<IEnumerable<int>>.Success(room.Data.DevicesId);
            return Ok(result.ToJson());
        }
    }
}
