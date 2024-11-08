using CasaAPI.DBContext.Device;
using CasaAPI.DBContext.Room;
using CasaAPI.Factories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<CasaAPI.Handlers.Device.GetHandler>();
builder.Services.AddSingleton<CasaAPI.Handlers.Device.PostHandler>();
builder.Services.AddSingleton<DeviceFactory>();
builder.Services.AddSingleton<DeviceDtoFactory>();
builder.Services.AddSingleton<DeviceDB>();
builder.Services.AddSingleton<CasaAPI.Handlers.Room.GetHandler>();
builder.Services.AddSingleton<RoomDB>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Casa Domotica"));

app.Run();
