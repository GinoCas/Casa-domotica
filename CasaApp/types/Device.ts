export default interface Room {
  Id: number;
  Name: string;
  Leds: Device[];
}

export interface Device {
  Id: number;
  Pin: number;
  State: boolean;
  Brightness: number;
  Voltage: number;
  Energy: number;
}
