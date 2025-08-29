# Clean Architecture Implementation

## Estructura del Proyecto

Esta implementación sigue los principios de **Clean Architecture**, organizando el código en capas bien definidas:

```
src/
├── core/                     # Capa de Dominio
│   ├── entities/            # Entidades de negocio
│   │   ├── Device.ts
│   │   └── Room.ts
│   └── repositories/        # Interfaces de repositorios
│       ├── IDeviceRepository.ts
│       └── IRoomRepository.ts
├── application/             # Capa de Aplicación
│   ├── dtos/               # Data Transfer Objects
│   │   └── CommandDto.ts
│   └── usecases/           # Casos de uso
│       ├── DeviceUseCases.ts
│       └── RoomUseCases.ts
├── infrastructure/         # Capa de Infraestructura
│   ├── api/               # Cliente HTTP
│   │   └── HttpClient.ts
│   └── repositories/      # Implementaciones concretas
│       ├── ApiDeviceRepository.ts
│       └── ApiRoomRepository.ts
├── services/              # Servicios de aplicación
│   ├── DeviceService.ts
│   └── RoomService.ts
├── hooks/                 # Hooks de React
│   └── useDeviceService.ts
├── components/            # Componentes de ejemplo
│   └── ExampleDeviceList.tsx
└── shared/               # Tipos y utilidades compartidas
    ├── Result.ts
    └── DependencyContainer.ts
```

## Capas de la Arquitectura

### 1. Core/Domain (Núcleo)

- **Entities**: Contienen la lógica de negocio y las reglas de dominio
- **Repositories**: Interfaces que definen contratos para acceso a datos
- **Sin dependencias externas**: Esta capa no depende de ninguna otra

### 2. Application (Aplicación)

- **Use Cases**: Orquestan la lógica de negocio para casos específicos
- **DTOs**: Objetos para transferencia de datos entre capas
- **Solo depende del Core**: No conoce detalles de infraestructura

### 3. Infrastructure (Infraestructura)

- **Repositorios concretos**: Implementan las interfaces del dominio
- **Cliente HTTP**: Maneja la comunicación con la API
- **Implementa los contratos del Core**: Depende de las interfaces del dominio

### 4. Presentation (Presentación)

- **Services**: Facade simplificado para los casos de uso
- **Hooks**: Lógica de React para manejo de estado
- **Components**: Componentes de UI que consumen los servicios

## Beneficios de esta Arquitectura

### 1. **Separación de Responsabilidades**

- Cada capa tiene una responsabilidad específica y bien definida
- Facilita el mantenimiento y la evolución del código

### 2. **Testabilidad**

- Cada capa puede ser probada de forma independiente
- Los mocks son fáciles de implementar gracias a las interfaces

### 3. **Flexibilidad**

- Cambiar la implementación de la API no afecta la lógica de negocio
- Puedes cambiar de REST a GraphQL sin modificar los casos de uso

### 4. **Reutilización**

- Los casos de uso pueden ser reutilizados en diferentes contextos
- La lógica de dominio es independiente de la UI

## Cómo Usar

### Ejemplo Básico:

```typescript
import { useDeviceList, useDeviceCommands } from '../hooks/useDeviceService';

const MyComponent = () => {
  const { devices, loading, error } = useDeviceList();
  const { setState } = useDeviceCommands();

  const handleToggle = async (deviceId: number, state: boolean) => {
    const result = await setState(deviceId, !state);
    if (!result.isSuccess) {
      console.error(result.errors);
    }
  };

  // ... resto del componente
};
```

### Uso Directo de Servicios:

```typescript
import { DeviceService } from '../services/DeviceService';

const deviceService = new DeviceService();
const result = await deviceService.getDeviceList();

if (result.isSuccess) {
  console.log(result.data);
} else {
  console.error(result.errors);
}
```

## Migración desde Código Anterior

1. **Reemplaza los imports antiguos** por los nuevos servicios
2. **Usa los hooks personalizados** para componentes de React
3. **Maneja los errores** usando el tipo `Result<T>`
4. **Aprovecha la validación automática** en los casos de uso

## Patrones Implementados

- **Repository Pattern**: Para abstracción de datos
- **Use Case Pattern**: Para lógica de aplicación
- **Dependency Injection**: Container simple para gestión de dependencias
- **Result Pattern**: Para manejo consistente de errores
- **Factory Pattern**: Para creación de DTOs y entidades

## Próximos Pasos

1. Migrar componentes existentes para usar la nueva arquitectura
2. Agregar más validaciones en los casos de uso
3. Implementar cache local usando el patrón Repository
4. Agregar logging y métricas
5. Implementar tests unitarios para cada capa
