export type DeviceType = "Led" | "Fan" | "Tv";

export interface BaseDevice {
  id: number;
  pin: number;
  state: boolean;
}

export interface PowerConsumable {
  voltage: number;
  amperes: number;
}

export interface Illuminable {
  brightness: number;
}

export interface Rotatable {
  speed: number;
}

export interface Device extends BaseDevice, PowerConsumable {
  type: DeviceType;
  [key: string]: any;
}
