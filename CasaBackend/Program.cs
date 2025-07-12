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
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("CasaDB"));
});
//Repositorios
builder.Services.AddScoped<IRepository<DeviceEntity>, DeviceRepository>();
builder.Services.AddScoped<ICapabilityRepository<DimmableEntity>, CapabilityRepository<DimmableEntity, DimmableModel>>();
builder.Services.AddScoped<ICapabilityRepository<VelocityEntity>, CapabilityRepository<VelocityEntity, VelocityModel>>();

builder.Services.AddScoped<ICapabilityProvider, CapabilityProvider<DimmableModel>>();
builder.Services.AddScoped<ICapabilityProvider, CapabilityProvider<VelocityModel>>();
builder.Services.AddScoped<CapabilityService>();

//Presentadores
builder.Services.AddScoped<IPresenter<DeviceEntity, DeviceViewModel>, DevicePresenter>();

//Handlers
builder.Services.AddScoped<ICommandHandler, BrightnessCommand>();

//Fabricas
builder.Services.AddScoped<IFactory<ICommandHandler, string>, CommandFactory>();
builder.Services.AddScoped<IFactory<DeviceEntity, DeviceContextDto>, CapabilityFactory>();

//Casos de uso
builder.Services.AddScoped<DoDeviceCommandUseCase<CommandDto>>();
builder.Services.AddScoped<GetDeviceUseCase<DeviceEntity, DeviceViewModel>>();


builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Casa Domotica"));

app.Run();
