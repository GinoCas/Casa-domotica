export type DeviceType = "Led" | "Fan";

export interface BaseDevice {
  deviceType: DeviceType;
  id: number;
  state: boolean;
  voltage: number;
  amperes: number;
}

export default interface Device {
  baseProperties: BaseDevice;
  [key: string]: any;
}
