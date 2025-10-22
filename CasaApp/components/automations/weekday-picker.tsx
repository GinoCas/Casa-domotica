import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import GlobalStyles from "@/Utils/globalStyles";

interface WeekDayOption {
  label: string;
  value: number;
}

const options: WeekDayOption[] = [
  { label: "D", value: 1 },
  { label: "L", value: 2 },
  { label: "M", value: 4 },
  { label: "X", value: 8 },
  { label: "J", value: 16 },
  { label: "V", value: 32 },
  { label: "S", value: 64 },
];

const WeekDayOptionComponent = ({
  weekday,
  onPressOption,
  isSelected,
}: {
  weekday: WeekDayOption;
  onPressOption: (weekday: WeekDayOption) => void;
  isSelected: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPressOption(weekday);
      }}
      style={{
        borderWidth: isSelected ? 1 : 0,
        borderColor: isSelected
          ? GlobalStyles.enabledColor
          : GlobalStyles.disabledColor,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
      }}
    >
      <Text
        style={{
          color: isSelected
            ? GlobalStyles.enabledColor
            : GlobalStyles.disabledColor,
        }}
      >
        {weekday.label}
      </Text>
    </TouchableOpacity>
  );
};

const WeekDayPicker = ({
  onSelectionChange,
  initialValue = [],
}: {
  onSelectionChange: (days: number[]) => void;
  initialValue?: number[];
}) => {
  const [selectedDays, setSelectedDays] = useState<number[]>(initialValue);

  const handlePressOption = (weekday: WeekDayOption) => {
    const isCurrentlySelected = selectedDays.includes(weekday.value);
    let newSelectedDays: number[];

    if (isCurrentlySelected) {
      newSelectedDays = selectedDays.filter((day) => day !== weekday.value);
    } else {
      newSelectedDays = [...selectedDays, weekday.value];
    }

    setSelectedDays(newSelectedDays);
    onSelectionChange(newSelectedDays);
  };

  return (
    <View>
      <Text>Días habilitados</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          justifyContent: "center",
          paddingVertical: 8,
        }}
      >
        {options.map((option) => (
          <WeekDayOptionComponent
            key={option.value}
            weekday={option}
            onPressOption={handlePressOption}
            isSelected={selectedDays.includes(option.value)}
          />
        ))}
      </View>
    </View>
  );
};

export default WeekDayPicker;
