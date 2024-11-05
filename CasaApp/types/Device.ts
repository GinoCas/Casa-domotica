export default interface Room {
  Id: number;
  Name: string;
  Leds: Led[];
}

export interface Led extends Device {
  Brightness: number;
}

export interface Device {
  Id: number;
  Pin: number;
  State: boolean;
  Voltage: number;
  Energy: number;
}
