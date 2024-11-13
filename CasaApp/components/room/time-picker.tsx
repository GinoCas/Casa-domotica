import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { StyleSheet, Button, SafeAreaView, Text, View } from "react-native";

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Selecciona la Hora</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={showTimepicker} title={date.toLocaleTimeString()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  buttonContainer: {
    width: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
});
