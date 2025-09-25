using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Services;
using CasaBackend.Casa.Core;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using System.IO.Ports;
using System.Text.Json;

namespace CasaBackend.Casa.Infrastructure.Services
{
	public class SerialService<TDTO> : IArduinoService<TDTO>
	{
		private readonly IConfiguration _configuration;
		private readonly ILogger<SerialService<TDTO>> _logger;
		private IMapper _mapper; 
		private SerialPort _serialPort;

		public SerialService(IConfiguration configuration, ILogger<SerialService<TDTO>> logger, IMapper mapper) 
		{
			_configuration = configuration;
			_logger = logger;
			_mapper = mapper;
		}
		public Task<CoreResult<bool>> ConnectAsync()
		{
			try
			{
				_serialPort = new SerialPort();
				_serialPort.PortName = _configuration["ARDUINO_PORTNAME"];
				_serialPort.BaudRate = int.Parse(_configuration["ARDUINO_BAUDRATE"]);
				_serialPort.Parity = Parity.None;
				_serialPort.DataBits = 8;
				_serialPort.StopBits = StopBits.One;
				_serialPort.Handshake = Handshake.None;
				_serialPort.Open();
				_logger.LogInformation("Serial port connected successfully.");
			}
			catch (System.Exception e)
			{
				_logger.LogError(e, "Error connecting to serial port.");
				return Task.FromResult(CoreResult<bool>.Failure(["Error connecting to serial port."]));
			}
			return Task.FromResult(CoreResult<bool>.Success(true));
		}
		public Task<CoreResult<bool>> PublishAsync(TDTO dto)
		{
			var json = JsonSerializer.Serialize(dto);
			_serialPort.WriteLine(json);
			return Task.FromResult(CoreResult<bool>.Success(true));
		}
		public Task<CoreResult<IEnumerable<TDTO>>> GetAllAsync()
		{
			try
			{
				if (_serialPort.IsOpen)
				{
					var message = _serialPort.ReadLine();
					var json = JsonSerializer.Deserialize<ArduinoMessageDto<TDTO>>(message);

					if (json == null)
					{
						return Task.FromResult(
							CoreResult<IEnumerable<TDTO>>.Failure(
								["La data nula."]
						));
					}
					var mappedData = _mapper.Map<IEnumerable<TDTO>>(json.Data);
					return Task.FromResult(CoreResult<IEnumerable<TDTO>>.Success(mappedData));
				}
			}
			catch (Exception e)
			{
				_logger.LogError(e, "Error reading from serial port.");
			}
			return Task.FromResult(CoreResult<IEnumerable<TDTO>>.Failure(["Error reading from serial port."]));
		}

	}
}
