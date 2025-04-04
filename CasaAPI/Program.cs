using CasaAPI.Arduino;
using CasaAPI.DBContext.Device;
using CasaAPI.DBContext.Room;
using CasaAPI.Factories;
using CasaAPI.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<CasaAPI.Handlers.Device.GetHandler>();
builder.Services.AddSingleton<CasaAPI.Handlers.Device.PostHandler>();
builder.Services.AddSingleton<CasaAPI.Handlers.Device.PutHandler>();
builder.Services.AddSingleton<DeviceFactory>();
builder.Services.AddSingleton<DeviceDtoFactory>();
builder.Services.AddSingleton<DeviceDB>();
builder.Services.AddSingleton<CasaAPI.Handlers.Room.GetHandler>();
builder.Services.AddSingleton<RoomDB>();
builder.Services.AddSingleton<Placeholders>();

builder.Services.AddSingleton<ArduinoConnection>();
builder.Services.AddSingleton<ArduinoManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Casa Domotica"));

var placeholders = app.Services.GetRequiredService<Placeholders>();

app.Run();
