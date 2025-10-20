# CasaESP32 Go Service

Servicio en Go que emula el firmware Arduino para control local y publicación por MQTT.

## Requisitos
- Go 1.21+
- Broker MQTT accesible (`test.mosquitto.org:1883` por defecto)

## Configuración
Variables de entorno:
- `MQTT_BROKER`: host del broker (por defecto `test.mosquitto.org`)
- `MQTT_PORT`: puerto del broker (por defecto `1883`)
- `PORT`: puerto HTTP local (por defecto `8080`; en Arduino se usa `80`)

## Ejecutar
```bash
cd Arduino/CasaESP32/go-service
go mod tidy
go run .
# o
go build -o casa-go-service.exe && ./casa-go-service.exe
```

## Endpoints HTTP (compatibles con Arduino)
- `PUT /device`: cuerpo JSON puede ser objeto o array. Campos: `Id`, `State`, `Type` ("Led"|"Fan"|"Tv"), `Brightness` (0-255), `Speed` (0-3).
- `PUT /automation`: `Id` (-1 para crear), `StartHour`, `StartMinute`, `EndHour`, `EndMinute`, `Days` (bitmask 0-127), `State`, `Devices: [{Id, State}]`.
- `DELETE /automation/{id}`: borra y publica `casa/automations/erase`.
- `PUT /time`: `{Hour, Minute, Second, WeekDay}` (0=Dom .. 6=Sab). 1 segundo real = 1 minuto simulado.
- `PUT /mode`: `{Name, State}` con Name=`activity` o `save-energy` (`saveenergy`, `save_energy`).
- `GET /`: alive => `OK`.

## MQTT
Publica con envoltura `{Data: ...}`:
- `casa/devices`: `[{Id, State, Type, Brightness?, Speed?}]`
- `casa/automations`: `{Id, StartHour, StartMinute, EndHour, EndMinute, Days, State, Devices}`
- `casa/automations/erase`: `{Id}`
- `casa/modes`: `{Name, State}`

Suscribe y procesa comandos:
- `casa/devices/cmd`: objeto o array con los mismos campos que `/device`.
- `casa/automations/cmd`: `{Cmd:"erase", Id}` o payload de automatización para crear/actualizar.
- `casa/modes/cmd`: `{Name, State}`.

## Notas
- Arranca con un conjunto de dispositivos y una automatización de ejemplo igual al firmware Arduino.
- El modo `SaveEnergy` limita brillo de LEDs a 128.
- El modo `Activity` enciende un dispositivo aleatorio cada 8–20s y publica estado agregado.