export interface GroupedOptions {
  label: string;
  options: Option[];
}

export interface Option {
  label: string;
  deviceId: number;
  deviceType: string;
}

export interface MultiComboGroupProps {
  onOptionPress: (option: Option) => void;
  options: GroupedOptions[];
  value?: Option[];
}
