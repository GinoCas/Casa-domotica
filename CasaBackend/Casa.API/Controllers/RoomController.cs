using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
        [HttpGet("/room/list")]
        public async Task<IActionResult> GetRoomList()
        {
            _logger.LogInformation("Obteniendo lista de habitaicones");
            var result = await getUseCase.ExecuteAsync();
            _logger.LogInformation("Lista de habitaciones obtenida correctamente. Total: {Count}", result.Data.Count());
            return Ok(result.ToJson());
        }
        [HttpGet("/room/{name}")]
        public async Task<IActionResult> GetRoomByName(string name)
        {
            _logger.LogInformation("Obteniendo habitacion con nombre: {DeviceId}", name);
            var result = await getUseCase.ExecuteAsync(name);
            if (!result.IsSuccess)
            {
                _logger.LogWarning("Habitacion {DeviceId} no encontrada: {Errors}",
                    name, string.Join(", ", result.Errors));
                return BadRequest(result.ToJson());
            }
            _logger.LogInformation("Habitacion {DeviceId} encontrada exitosamente", name);
            return Ok(result.ToJson());
        }
    }
}
