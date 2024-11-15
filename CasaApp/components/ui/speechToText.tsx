import { Text, View } from "react-native";
import Voice from "@react-native-voice/voice";
import { useEffect, useState } from "react";
import {
  TurnOffAllLedsOfRoom,
  TurnOnAllLedsOfRoom,
} from "@/Utils/GeneralCommands";
import useSpeechStore from "@/stores/useSpeechStore";

export default function SpeechToText() {
  const {
    isHearing,
    isSpeaking,
    results,
    changeHearing,
    changeSpeaking,
    handleLoadResults,
  } = useSpeechStore();
  const [partialResults, setPartialResults] = useState([]);
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = writeSpeech;
    Voice.onSpeechEnd = stopHearing;
    startHearing();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startHearing = async () => {
    await Voice.start("es-ES");
    changeHearing(true);
  };

  const stopHearing = async () => {
    await Voice.stop();
    changeSpeaking(false);
    changeHearing(false);
  };

  const onSpeechResults = (result: any) => {
    handleLoadResults(result.value);
    handleVoiceCommands(result.value);
  };

  const writeSpeech = (result: any) => {
    setPartialResults(result.value);
    changeSpeaking(true);
  };

  const verbs: { [key: string]: string } = {
    prender: "on",
    prende: "on",
    prendes: "on",
    prenderme: "on",
    prenda: "on",
    activar: "on",
    activa: "on",
    activas: "on",
    activame: "on",
    encender: "on",
    enciende: "on",
    encendes: "on",
    encéndeme: "on",
    iluminar: "on",
    iluminas: "on",
    ilumina: "on",
    iluminame: "on",
    arrancar: "on",
    arranca: "on",
    arrancas: "on",
    arráncame: "on",
    poner: "on",
    pone: "on",
    pones: "on",
    ponerme: "on",
    apagar: "off",
    apaga: "off",
    apagas: "off",
    apágame: "off",
    desactivar: "off",
    desactiva: "off",
    desactivas: "off",
    desactivame: "off",
    suspender: "off",
    suspende: "off",
    suspendes: "off",
    suspéndeme: "off",
  };

  const locations: { [key: string]: string } = {
    cocina: "kitchen",
    comedor: "diningRoom",
    sala: "living",
    living: "living",
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
      const actions: {
        verb: string;
        location: string;
        device: string | undefined;
      }[] = [];
      let usingVerb: string = "";
      commandParts.forEach((part, index) => {
        let verb = Object.keys(verbs).find((v) => part.includes(v));
        const locationKey = Object.keys(locations).find((loc) =>
          part.includes(loc)
        );
        const device = Object.keys(devices).find((syn) => part.includes(syn));

        if (!verb && index !== 0) {
          verb = usingVerb;
        }
        if (verb && locationKey) {
          console.log("VOICE:" + `${verb} ${device} en ${locationKey}`);
          usingVerb = verb;
          actions.push({
            verb: verbs[verb],
            location: locations[locationKey],
            device: device ? devices[device] : undefined,
          });
        }
      });
      if (actions.length > 0) {
        actions.forEach(({ verb, location, device }) => {
          try {
            executeCommand(verb, location, device);
          } catch {}
        });
        return;
      }
    }
  };

  const executeCommand = (
    action: string,
    location: string,
    device: string | undefined
  ) => {
    if (action === "activate" && device === "cinemaMode") {
      return;
    }
    console.log("COMMAND:" + `${action} ${device} en ${location}`);
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
      {isHearing ? (
        !isSpeaking ? (
          <Text style={{ marginTop: 10, color: "gray" }}>
            ¿Puedes prender las luces de la cocina?
          </Text>
        ) : (
          <Text>{partialResults[0]}</Text>
        )
      ) : (
        <Text>{results[0]}</Text>
      )}
    </View>
  );
}
