import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";

export const TimePickerTest = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate || new Date());
  };

  const showMode = (currentMode: "time") => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView>
      <Button onPress={showTimepicker} title="Show time picker" />
      <Text>selected: {date.toLocaleTimeString()}</Text>
    </SafeAreaView>
  );
};
