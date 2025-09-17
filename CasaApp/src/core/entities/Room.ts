// Entidad del dominio - Room
export class Room {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description?: string,
    public readonly deviceIds: number[] = [],
  ) {}

  // Métodos de dominio
  hasDevices(): boolean {
    return this.deviceIds.length > 0;
  }

  addDevice(deviceId: number): Room {
    if (this.deviceIds.includes(deviceId)) {
      return this;
    }
    return new Room(this.id, this.name, this.description, [
      ...this.deviceIds,
      deviceId,
    ]);
  }

  removeDevice(deviceId: number): Room {
    return new Room(
      this.id,
      this.name,
      this.description,
      this.deviceIds.filter((id) => id !== deviceId),
    );
  }

  static createFromApiResponse(data: any): Room {
    return new Room(
      data.id, 
      data.name, 
      data.description, 
      data.deviceIds ?? data.devicesId ?? []
    );
  }
}
