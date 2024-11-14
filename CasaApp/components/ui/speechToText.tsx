import { Button, Text, View } from "react-native";
import Voice from "@react-native-voice/voice";
import { useEffect, useState } from "react";
import {
  TurnOffAllLedsOfRoom,
  TurnOnAllLedsOfRoom,
} from "@/Utils/GeneralCommands";

export default function SpeechToText() {
  const [hearing, setHearing] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = stopHearing;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startHearing = async () => {
    await Voice.start("es-ES");
    setHearing(true);
  };

  const stopHearing = async () => {
    await Voice.stop();
    setHearing(false);
  };

  const onSpeechResults = (result: any) => {
    setResult(result.value);
    handleVoiceCommands(result.value);
  };

  const verbs: { [key: string]: string } = {
    prender: "on",
    prende: "on",
    activar: "on",
    encender: "on",
    iluminar: "on",
    apagar: "off",
    desactivar: "off",
  };

  const locations: { [key: string]: string } = {
    cocina: "kitchen",
    comedor: "diningRoom",
    sala: "livingRoom",
    baño: "bathroom",
  };

  const devices: { [key: string]: string } = {
    luz: "led",
    luces: "led",
    led: "led",
    leds: "led",
    foco: "led",
    focos: "led",
    lampara: "led",
    lamparas: "led",
    lámpara: "led",
    bombilla: "led",
    bombillas: "led",
    farol: "led",
    "   foco led": "led",
  };

  const handleVoiceCommands = (results: string[]) => {
    for (const text of results) {
      const lowerText = text.toLowerCase();
      if (lowerText.includes("modo cine")) {
        return;
      }

      const commandParts = lowerText.split(" y ");
      const actions = [];
      for (const part of commandParts) {
        const verb = Object.keys(verbs).find((v) => part.includes(v));
        const locationKey = Object.keys(locations).find((loc) =>
          part.includes(loc)
        );
        const device = Object.keys(devices).find((syn) => part.includes(syn));

        if (verb && locationKey && device) {
          actions.push({ action: verb, location: locationKey, device: device });
        }
      }
      if (actions.length > 0) {
        actions.forEach(({ action, location, device }) => {
          console.log(`${action} ${device} en ${location}`);
          try {
            executeCommand(verbs[action], locations[location], devices[device]);
          } catch {}
        });
        return;
      }
    }
  };

  const executeCommand = (action: string, location: string, device: string) => {
    if (action === "activate" && device === "cinemaMode") {
      return;
    }
    console.log(`${action} ${device} en ${location}`);
    switch (action) {
      case "on":
        TurnOnAllLedsOfRoom(location);
        break;
      case "off":
        TurnOffAllLedsOfRoom(location);
        break;
      default:
        console.log("Acción no reconocida");
    }
  };

  return (
    <View>
      {!hearing ? (
        <Button title="Start Speaking" onPress={startHearing}></Button>
      ) : (
        <Button title="Stop Speaking" onPress={stopHearing}></Button>
      )}
      {result.map((result, index) => (
        <Text key={index}>{result}</Text>
      ))}
    </View>
  );
}
