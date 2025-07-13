using CasaBackend.Casa.Core;

namespace CasaBackend.Casa.API.Middleware
{
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<ExceptionMiddleware> _logger = logger;
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Excepción no controlada en {Path}: {Message}",
                    context.Request.Path, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }
        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var (statusCode, message) = GetErrorResponse(exception);
            context.Response.StatusCode = statusCode;
            CoreResult<bool> errorResponse = new(false, false, [exception.Message, message]);
            var jsonResponse = errorResponse.ToJson();
            await context.Response.WriteAsync(jsonResponse);
        }
        private static (int statusCode, string message) GetErrorResponse(Exception exception)
        {
            return exception switch
            {
                ArgumentException => (400, "Parámetros inválidos proporcionados"),
                UnauthorizedAccessException => (401, "Acceso no autorizado"),
                KeyNotFoundException => (404, "Recurso no encontrado"),
                InvalidOperationException => (409, "Operación no válida en el estado actual"),
                TimeoutException => (408, "La operación ha excedido el tiempo límite"),
                _ => (500, "Error interno del servidor")
            };
        }
    }
}
