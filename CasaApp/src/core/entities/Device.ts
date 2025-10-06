export type DeviceType = "Led" | "Fan" | "Tv";

export interface BaseDevice {
  id: number;
  state: boolean;
}

export type CapabilityType = "Dimmable" | "Velocity" | "Color" | "Temperature";

export interface Capability {
  capabilityType: CapabilityType;
  [key: string]: any;
}

export interface Device extends BaseDevice {
  deviceType: DeviceType;
  name: string;
  description: string;
  capabilities: Capability[];
}
