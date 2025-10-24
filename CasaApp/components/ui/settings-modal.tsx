import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import CustomModal from "@/components/ui/modal";
import useConfigStore from "@/stores/useConfigStore";
import GlobalStyles from "@/Utils/globalStyles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function normalizeUrl(input: string) {
  let url = (input || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }
  url = url.replace(/\/$/, "");
  return url;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { arduinoIp, setArduinoIp } = useConfigStore();
  const [ipText, setIpText] = useState<string>(arduinoIp ?? "");
  const [error, setError] = useState<string>("");

  const canSave = useMemo(() => ipText.trim().length > 0, [ipText]);

  const handleSave = () => {
    const normalized = normalizeUrl(ipText);
    if (!normalized) {
      setError("Ingresá una IP o URL válida");
      return;
    }
    setArduinoIp(normalized);
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Configuración">
      <View style={styles.container}>
        <Text style={styles.label}>IP local del Arduino</Text>
        <TextInput
          style={styles.input}
          value={ipText}
          onChangeText={(t) => {
            setError("");
            setIpText(t);
          }}
          placeholder="http://192.168.0.10:80"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.btn, styles.cancel]}
          >
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.btn, canSave ? styles.save : styles.disabled]}
            disabled={!canSave}
          >
            <Text style={[styles.btnText, { color: "white" }]}>Guardar</Text>
          </TouchableOpacity>
        </View>
        {arduinoIp ? (
          <Text style={styles.current}>Actual: {arduinoIp}</Text>
        ) : null}
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 12, gap: 10, width: "100%" },
  label: { fontSize: 14, color: "#333" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  error: { color: "#e74c3c" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    width: "50%",
  },
  cancel: { backgroundColor: GlobalStyles.disabledColor },
  save: { backgroundColor: GlobalStyles.enabledColor },
  disabled: { backgroundColor: "#bdc3c7" },
  btnText: { fontSize: 14 },
  current: { marginTop: 6, fontSize: 12, color: "#7f8c8d" },
});
