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
  onOptionChange: (option: Option[]) => void;
  onClose: () => void;
  options: GroupedOptions[];
  value?: Option[];
}
