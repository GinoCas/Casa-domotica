using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class AliveController : ControllerBase
    {
        [HttpGet("/alive")]
        public IActionResult Alive()
        {
            var result = CoreResult<bool>.Success(true);
            return Ok(result.ToJson());
        }
    }
}