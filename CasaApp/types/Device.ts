export type DeviceType = "Led" | "Fan" | "Tv";

export interface BaseDevice {
  id: number;
  state: boolean;
}

export interface PowerConsumable {
  voltage: number;
  amperes: number;
}

export interface IDimmable {
  brightness: number;
}

export interface IVelocity {
  speed: number;
}

export interface Device extends BaseDevice, PowerConsumable {
  deviceType: DeviceType;
  [key: string]: any;
}
