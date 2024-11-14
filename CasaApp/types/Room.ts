import Device from "./Device";

export default interface Room {
  Id: number;
  Name: string;
  Devices: Device[];
}
