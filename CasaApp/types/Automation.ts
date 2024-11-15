export interface Automation {
  id: number;
  title: string;
  description: string;
  devices: { id: number; state: boolean }[];
  initTime: string;
  endTime: string;
  state: boolean;
}
