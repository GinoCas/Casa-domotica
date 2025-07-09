using CasaBackend.Casa.Application.Commands;
using CasaBackend.Casa.Application.Factories;
using CasaBackend.Casa.Application.Interfaces.Command;
using CasaBackend.Casa.Application.Interfaces.Repositories;
using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Application.Services;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Infrastructure;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.Infrastructure.Repositories;
using CasaBackend.Casa.InterfaceAdapter.Mapper;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("CasaDB"));
});
//Repositorios
builder.Services.AddScoped<IRepository<DeviceEntity>, DeviceRepository>();
builder.Services.AddScoped<ICapabilityRepository<DimmableEntity>, DimmableRepository>();

//Handlers
builder.Services.AddScoped<ICommandHandler, BrightnessCommand>();

//Fabricas
builder.Services.AddScoped<CommandFactory>();
builder.Services.AddScoped<CapabilityFactory>();

//Servicios
builder.Services.AddScoped<ICommandService, CommandService>();


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
