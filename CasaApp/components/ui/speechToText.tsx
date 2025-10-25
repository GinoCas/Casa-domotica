import { Text, View } from "react-native";
import Voice from "@react-native-voice/voice";
import { useEffect, useState } from "react";
import {
  toggleAllDevices,
  toggleTv,
  turnOffAllLedsOfRoom,
  turnOnAllLedsOfRoom,
  toggleAllDevicesOfRoom,
} from "@/Utils/GeneralCommands";
import useSpeechStore from "@/stores/useSpeechStore";

export default function SpeechToText() {
  const {
    results,
    isSpeaking,
    changeHearing,
    changeSpeaking,
    handleLoadResults,
    handleLoadVoice,
    handleLoadCmdVoice,
  } = useSpeechStore();
  const [partialResults, setPartialResults] = useState([]);
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = writeSpeech;
    Voice.onSpeechEnd = stopHearing;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechError = onSpeechError;
    startHearing();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startHearing = async () => {
    await Voice.start("es-ES");
    changeHearing(true);
    changeSpeaking(false);
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

  const onSpeechStart = (e: any) => {
    changeSpeaking(true);
  };

  const onSpeechError = (e: any) => {
    try {
      stopHearing();
    } catch {}
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
    apague: "off",
    apagá: "off",
    apagas: "off",
    apagás: "off",
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
    cocina: "cocina",
    comedor: "comedor",
    sala: "sala",
    salon: "sala",
    living: "sala",
    baño: "baño",
    aseo: "baño",
    lavabo: "baño",
    patio: "patio",
    jardín: "patio",
    huerto: "patio",
    garage: "garage",
    garaje: "garage",
    estacionamiento: "garage",
    cochera: "garage",
    "primera habitación": "habitacion azul",
    "segunda habitación": "habitacion marron",
    "habitación principal": "habitacion azul",
    "habitación secundaria": "habitacion marron",
    "habitación azul": "habitacion azul",
    "habitación marrón": "habitacion marron",
    habitación: "habitacion azul",
    dormitorio: "habitacion azul",
    cuarto: "habitacion azul",
    "primer cuarto": "habitacion azul",
    "segundo cuarto": "habitacion marron",
    "cuarto azul": "habitacion azul",
    "cuarto marrón": "habitacion azul",
    "cuarto principal": "habitacion azul",
    "cuarto secundario": "habitacion azul",
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
    "foco led": "led",
    tele: "tv",
    tv: "tv",
    televisor: "tv",
  };

  const handleVoiceCommands = (results: string[]) => {
    console.log("resultados:", results);
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
      let usingDevice: string | undefined;
      commandParts.forEach((part, index) => {
        let verb = Object.keys(verbs).find((v) => part.includes(v));
        const locationKey = Object.keys(locations).find((loc) =>
          part.includes(loc),
        );
        const deviceSyn = Object.keys(devices).find((syn) =>
          part.includes(syn),
        );

        const refersToPrevDevice = /(^|\s)(del|de\s+(la|las|el|los))\b/.test(
          part,
        );

        if (!verb && index !== 0) {
          verb = usingVerb;
        }

        let device = deviceSyn ? devices[deviceSyn] : undefined;
        if (!device && index !== 0) {
          if (refersToPrevDevice || !locationKey) {
            device = usingDevice;
          }
        }

        if (verb) {
          console.log("VOICE:" + `${verb} ${device} en ${locationKey}`);
          handleLoadVoice("VOICE:" + `${verb} ${device} en ${locationKey}`);
          usingVerb = verb;
          if (deviceSyn) {
            usingDevice = devices[deviceSyn];
          }
          let location = "todas";
          if (locationKey) {
            location = locations[locationKey];
          }
          actions.push({
            verb: verbs[verb],
            location: location,
            device: device,
          });
        }
      });
      actions.sort((a, b) => {
        if (a.location === "todas" && b.location !== "todas") {
          return -1;
        }
        if (a.location !== "todas" && b.location === "todas") {
          return 1;
        }
        return 0;
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
    device: string | undefined,
  ) => {
    if (action === "activate" && device === "cinemaMode") {
      return;
    }
    console.log("COMMAND:" + `${action} ${device} en ${location}`);
    handleLoadCmdVoice("COMMAND:" + `${action} ${device} en ${location}`);
    switch (action) {
      case "on":
        if (device === "tv") {
          toggleTv(true);
          return;
        }
        if (device === "led") {
          turnOnAllLedsOfRoom(location);
          return;
        }
        if (!device && location !== "todas") {
          toggleAllDevicesOfRoom(location, true);
          return;
        }
        toggleAllDevices(true);
        break;
      case "off":
        if (device === "tv") {
          toggleTv(false);
          return;
        }
        if (device === "led") {
          turnOffAllLedsOfRoom(location);
          return;
        }
        if (!device && location !== "todas") {
          toggleAllDevicesOfRoom(location, false);
          return;
        }
        toggleAllDevices(false);
        break;
      default:
        console.log("Acción no reconocida");
    }
  };

  return (
    <View>
      {partialResults[0] === undefined ? (
        <Text style={{ marginTop: 10, color: "gray" }}>
          ¿Puedes prender las luces de la cocina?
        </Text>
      ) : isSpeaking ? (
        <Text>{partialResults[0]}</Text>
      ) : (
        <Text>{results[0]}</Text>
      )}
    </View>
  );
}
