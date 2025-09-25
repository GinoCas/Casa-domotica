using CasaBackend.Casa.API.Middleware;
using CasaBackend.Casa.API.Validators;
using CasaBackend.Casa.Application.Commands;
using CasaBackend.Casa.Application.Factories;
using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Providers;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Infrastructure;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.Infrastructure.Providers;
using CasaBackend.Casa.Infrastructure.Repositories;
using CasaBackend.Casa.Infrastructure.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Mapper;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.Presenters;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using CasaBackend.Casa.Application.Interfaces.Services;

Env.Load();

var builder = WebApplication.CreateBuilder(args);


string? port = Environment.GetEnvironmentVariable("API_PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://localhost:{port}");
}

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
    });

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("CasaDB");
    var dbHost = Environment.GetEnvironmentVariable("DB_CONN");
    var finalConnectionString = connectionString.Replace("{DB_CONN}", dbHost);
    options.UseSqlServer(finalConnectionString);
});
//Repositorios
builder.Services.AddScoped<IDeviceRepository<DeviceEntity>, DeviceRepository>();
builder.Services.AddScoped<IAutomationRepository<AutomationEntity>, AutomationRepository>();
builder.Services.AddScoped<IRoomRepository<RoomEntity>, RoomRepository>();
builder.Services.AddScoped<ICapabilityRepository<DimmableEntity>, CapabilityRepository<DimmableEntity, DimmableModel>>();
builder.Services.AddScoped<ICapabilityRepository<VelocityEntity>, CapabilityRepository<VelocityEntity, VelocityModel>>();

//Providers
builder.Services.AddScoped<ICapabilityProvider, CapabilityProvider<DimmableModel>>();
builder.Services.AddScoped<ICapabilityProvider, CapabilityProvider<VelocityModel>>();
builder.Services.AddScoped<CapabilityService>();

//Validadores
builder.Services.AddValidatorsFromAssemblyContaining<DeviceValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CommandValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<AutomationValidator>();

//Presentadores
builder.Services.AddScoped<IPresenter<DeviceEntity, DeviceViewModel>, DevicePresenter>();
builder.Services.AddScoped<IPresenter<AutomationEntity, AutomationViewModel>, AutomationPresenter>();

//Handlers
builder.Services.AddScoped<ICommandHandler, SetStateCommand>(provider =>
    new SetStateCommand(
        provider.GetRequiredService<IDeviceRepository<DeviceEntity>>(),
        "setState", new Dictionary<string, Type> { { "state", typeof(bool) } }));

builder.Services.AddScoped<ICommandHandler, CapabilityCommand<DimmableEntity>>(provider =>
    new CapabilityCommand<DimmableEntity>(
        provider.GetRequiredService<ICapabilityRepository<DimmableEntity>>(),
        "setBrightness", new Dictionary<string, Type> { { "brightness", typeof(int) } }));

builder.Services.AddScoped<ICommandHandler, CapabilityCommand<VelocityEntity>>(provider =>
    new CapabilityCommand<VelocityEntity>(
        provider.GetRequiredService<ICapabilityRepository<VelocityEntity>>(),
        "setSpeed", new Dictionary<string, Type> { { "speed", typeof(int) } }));

//Fabricas
builder.Services.AddScoped<IFactory<ICommandHandler, string>, CommandFactory>();
builder.Services.AddScoped<IFactory<DeviceEntity, DeviceContextDto>, CapabilityFactory>();

//Casos de uso
builder.Services.AddScoped<DoDeviceCommandUseCase<CommandDto>>();
builder.Services.AddScoped<GetDeviceUseCase<DeviceEntity, DeviceViewModel>>();
builder.Services.AddScoped<GetRoomUseCase<RoomEntity>>();

builder.Services.AddScoped<GetAutomationUseCase<AutomationEntity, AutomationViewModel>>();
builder.Services.AddScoped<CreateAutomationUseCase<AutomationEntity, AutomationDto>>();
builder.Services.AddScoped<UpdateAutomationUseCase>();
builder.Services.AddScoped<EraseAutomationUseCase<AutomationEntity>>();

builder.Services.AddSingleton<MqttService<DeviceEntity>>();
builder.Services.AddSingleton<IArduinoService<ArduinoDeviceDto>, SerialService<ArduinoDeviceDto>>();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Services.GetRequiredService<IArduinoService<ArduinoDeviceDto>>().ConnectAsync();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Casa Domotica"));

app.Run();
