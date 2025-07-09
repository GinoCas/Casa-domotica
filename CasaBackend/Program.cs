using Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.Core.Interfaces.Command;
using CasaBackend.Casa.Core.Interfaces.Repositories;
using CasaBackend.Casa.Core.Interfaces.Services;
using CasaBackend.Casa.Infrastructure.Commands;
using CasaBackend.Casa.Infrastructure.Factories;
using CasaBackend.Casa.Infrastructure.Mapper;
using CasaBackend.Casa.Infrastructure.Repositories;
using CasaBackend.Casa.InterfaceAdapter;
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
builder.Services.AddScoped<DeviceFactory>();

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
