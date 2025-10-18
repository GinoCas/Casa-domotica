import getTimeString from "@/Utils/getTimeString";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Button,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { TimeService } from "../../src/services/TimeService";
import { ArduinoTimeDto } from "../../src/application/dtos/ArduinoTimeDto";

export const TimePickerTest = () => {
  const [date, setDate] = useState(new Date());
  const timeServiceRef = useRef(new TimeService());
  const weekDayLabels = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  // Mantener siempre la última fecha seleccionada para evitar cierres obsoletos
  const latestDateRef = useRef(date);
  useEffect(() => {
    latestDateRef.current = date;
  }, [date]);

  useEffect(() => {
    const interval = setInterval(incrementTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const SYNC_INTERVAL_MS = 15000; // sincroniza cada 15s
    const interval = setInterval(
      () => syncArduino(latestDateRef.current),
      SYNC_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, []);

  const incrementTime = () => {
    setDate((prevTime: Date) => {
      const newTime = new Date(prevTime);
      newTime.setMilliseconds(0);
      newTime.setSeconds(0);
      newTime.setMinutes(newTime.getMinutes() + 1);
      return newTime;
    });
  };

  const syncArduino = (d?: Date) => {
    const dateToSync = d ?? date;
    const payload: ArduinoTimeDto = {
      Hour: dateToSync.getHours(),
      Minute: dateToSync.getMinutes(),
      Second: 0,
      WeekDay: dateToSync.getDay(),
    };
    timeServiceRef.current
      .sync(payload)
      .then((res) => {
        if (!res.isSuccess) {
          console.log("Sync fallo:", res.errors);
        }
      })
      .catch((err) => console.log("Sync error:", err?.message || err));
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") return;
    const currentDate = selectedDate ?? new Date();
    setDate(currentDate);
    syncArduino(currentDate);
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

  const setWeekDay = (d: Date, targetDay: number) => {
    const currentDay = d.getDay();
    const diff = (targetDay - currentDay + 7) % 7;
    const newDate = new Date(d);
    newDate.setDate(newDate.getDate() + diff);
    newDate.setMilliseconds(0);
    newDate.setSeconds(0);
    return newDate;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Selecciona la Hora</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={showTimepicker} title={getTimeString(date)} />
      </View>
      <Text style={styles.subtitle}>Selecciona el día</Text>
      <View style={styles.weekRow}>
        {weekDayLabels.map((label, idx) => {
          const selected = idx === date.getDay();
          return (
            <TouchableOpacity
              key={label}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => {
                const updated = setWeekDay(date, idx);
                setDate(updated);
                syncArduino(updated);
              }}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  buttonContainer: {
    width: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  weekRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  chipText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
  },
});
