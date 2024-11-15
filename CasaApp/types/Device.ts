export type DeviceType = "Led" | "Fan";

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
