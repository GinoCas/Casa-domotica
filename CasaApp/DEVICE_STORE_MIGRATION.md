# Migración del useDeviceStore

## Cambios Principales

### 1. Nueva Estructura de Datos

Antes el store guardaba directamente las entidades `Device`, ahora usa una interfaz `DeviceWithState` que envuelve la entidad junto con su estado dinámico:

```typescript
interface DeviceWithState {
  device: Device; // La entidad inmutable del dominio
  state?: boolean; // Estado actual (encendido/apagado)
  brightness?: number; // Brillo actual
  speed?: number; // Velocidad actual
}
```

### 2. Uso del Nuevo Store

#### Antes:

```typescript
const { devices, toggleDeviceState } = useDeviceStore();
const device = devices.find((d) => d.id === deviceId);
console.log(device.name); // Acceso directo a las propiedades
```

#### Ahora:

```typescript
const { devices, toggleDeviceState } = useDeviceStore();
const deviceWithState = devices.find((d) => d.device.id === deviceId);
console.log(deviceWithState.device.name); // Acceso a través de .device
console.log(deviceWithState.state); // Estado dinámico
console.log(deviceWithState.brightness); // Brillo dinámico
```

### 3. Métodos Actualizados

#### `getDeviceById` ahora retorna `DeviceWithState`:

```typescript
const result = useDeviceStore.getState().getDeviceById(deviceId);
if (result.isSuccess) {
  const deviceWithState = result.data;
  console.log(deviceWithState.device.name);
  console.log(deviceWithState.state);
}
```

#### `toggleDeviceState` es ahora asíncrono y maneja errores:

```typescript
await toggleDeviceState(deviceId, true);
```

#### `setDeviceBrightness` actualiza el estado local inmediatamente:

```typescript
setDeviceBrightness(deviceId, 75); // Actualiza inmediatamente
await syncChanges(); // Sincroniza con el servidor
```

### 4. Ejemplo de Componente

```typescript
import React from 'react';
import useDeviceStore from './useDeviceStore';

const DeviceComponent = () => {
  const { devices, toggleDeviceState, setDeviceBrightness, syncChanges } = useDeviceStore();

  const handleToggle = async (deviceId: number, currentState: boolean) => {
    await toggleDeviceState(deviceId, !currentState);
  };

  const handleBrightnessChange = (deviceId: number, brightness: number) => {
    setDeviceBrightness(deviceId, brightness);
    // Los cambios de brillo se sincronizan automáticamente en el background
    // o puedes llamar syncChanges() manualmente
  };

  return (
    <div>
      {devices.map((deviceWithState) => (
        <div key={deviceWithState.device.id}>
          <h3>{deviceWithState.device.name}</h3>
          <p>Type: {deviceWithState.device.type}</p>
          <p>Current State: {deviceWithState.state ? 'ON' : 'OFF'}</p>

          {deviceWithState.device.hasState() && (
            <button
              onClick={() => handleToggle(
                deviceWithState.device.id,
                deviceWithState.state || false
              )}
            >
              Toggle
            </button>
          )}

          {deviceWithState.device.canBeDimmed() && (
            <input
              type="range"
              min="0"
              max="100"
              value={deviceWithState.brightness || 0}
              onChange={(e) => handleBrightnessChange(
                deviceWithState.device.id,
                parseInt(e.target.value)
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
```

### 5. Beneficios de los Cambios

1. **Separación Clara**: Las entidades de dominio (`Device`) están separadas del estado de la UI
2. **Inmutabilidad**: Las entidades del dominio son inmutables
3. **Mejor Manejo de Errores**: Los comandos ahora devuelven `Result<T>` para manejo consistente de errores
4. **Estado Optimista**: Los cambios se reflejan inmediatamente en la UI
5. **Sincronización**: Los cambios pendientes se pueden sincronizar en lotes

### 6. Tareas de Migración

1. Actualizar todos los componentes que usen `useDeviceStore`
2. Cambiar accesos directos a propiedades por `deviceWithState.device.property`
3. Manejar el estado dinámico a través de `deviceWithState.state`, etc.
4. Implementar manejo de errores para operaciones asíncronas
5. Considerar cuándo llamar `syncChanges()` para optimizar las llamadas a la API
