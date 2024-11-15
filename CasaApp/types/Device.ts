export type DeviceType = "Led" | "Fan" | "Tv";

export interface BaseDevice {
  id: number;
  pin: number;
  state: boolean;
  voltage: number;
  amperes: number;
}

export default interface Device {
  deviceType: DeviceType;
  baseProperties: BaseDevice;
  [key: string]: any;
}
