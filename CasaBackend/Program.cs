using CasaBackend.Casa.API.Middleware;
using CasaBackend.Casa.API.Validators;
using CasaBackend.Casa.Application.Factories;
using CasaBackend.Casa.Application.Handlers;
using CasaBackend.Casa.Application.Interfaces.Factory;
using CasaBackend.Casa.Application.Interfaces.Handlers;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Application.Interfaces.Providers;
using CasaBackend.Casa.Application.Interfaces.Registries;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Application.UseCases;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.Infrastructure;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.Infrastructure.Handlers;
using CasaBackend.Casa.Infrastructure.Providers;
using CasaBackend.Casa.Infrastructure.Registries;
using CasaBackend.Casa.Infrastructure.Repositories;
using CasaBackend.Casa.Infrastructure.Services;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Mapper;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.Presenters;
using DotNetEnv;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

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

//Registries
builder.Services.AddSingleton<ICapabilityRegistry, CapabilityRegistry>();

//Providers
builder.Services.AddScoped<ICapabilityProvider, CapabilityProvider<DimmableModel>>();
builder.Services.AddScoped<ICapabilityProvider, CapabilityProvider<VelocityModel>>();

//Validadores
builder.Services.AddValidatorsFromAssemblyContaining<DeviceValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CommandValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<AutomationValidator>();

//Presentadores
builder.Services.AddScoped<IPresenter<DeviceEntity, DeviceViewModel>, DevicePresenter>();
builder.Services.AddScoped<IPresenter<AutomationEntity, AutomationViewModel>, AutomationPresenter>();

//Handlers - Comandos
builder.Services.AddScoped<ICommandHandler, SetStateCommandHandler>(provider =>
    new SetStateCommandHandler(
        provider.GetRequiredService<IDeviceRepository<DeviceEntity>>(),
        "setState", new Dictionary<string, Type> { { "state", typeof(bool) } }));

builder.Services.AddScoped<ICommandHandler, CapabilityCommandHandler<DimmableEntity>>(provider =>
    new CapabilityCommandHandler<DimmableEntity>(
        provider.GetRequiredService<ICapabilityRepository<DimmableEntity>>(),
        "setBrightness", new Dictionary<string, Type> { { "brightness", typeof(int) } }));

builder.Services.AddScoped<ICommandHandler, CapabilityCommandHandler<VelocityEntity>>(provider =>
    new CapabilityCommandHandler<VelocityEntity>(
        provider.GetRequiredService<ICapabilityRepository<VelocityEntity>>(),
        "setSpeed", new Dictionary<string, Type> { { "speed", typeof(int) } }));

//Handlers - MQTT
builder.Services.AddScoped<IMQTTHandler, ArduinoDeviceMessageHandler>();

//Fabricas
builder.Services.AddScoped<IFactory<ICommandHandler, string>, CommandFactory>();
builder.Services.AddScoped<IFactory<DeviceEntity, DeviceContextDto>, DeviceFactory>();

builder.Services.AddScoped<IFactory<IEnumerable<ICapabilityEntity>, DeviceType>, CapabilityFactory>();
//Casos de uso
builder.Services.AddScoped<DoDeviceCommandUseCase<CommandDto>>();
builder.Services.AddScoped<GetDeviceUseCase<DeviceEntity, DeviceViewModel>>();
builder.Services.AddScoped<GetArduinoDevicesUseCase>();
builder.Services.AddScoped<GetRoomUseCase<RoomEntity>>();

builder.Services.AddScoped<GetAutomationUseCase<AutomationEntity, AutomationViewModel>>();
builder.Services.AddScoped<CreateAutomationUseCase<AutomationEntity, AutomationDto>>();
builder.Services.AddScoped<UpdateAutomationUseCase>();
builder.Services.AddScoped<EraseAutomationUseCase<AutomationEntity>>();

// Services
builder.Services.AddScoped<CapabilityService>();
builder.Services.AddHostedService<MQTTService>();

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

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Casa Domotica"));

app.Run();
