import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import CustomModal from "@/components/ui/modal";
import GlobalStyles from "@/Utils/globalStyles";
import SpeechToText from "@/components/ui/speechToText";
import useSpeechStore from "@/stores/useSpeechStore";

const globalStyles = GlobalStyles;

export default function TabsLayout() {
  const { isHearing } = useSpeechStore();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [wasHearing, setWasHearing] = useState(false);

  useEffect(() => {
    if (isModalOpen && isHearing) {
      setWasHearing(true);
    }
  }, [isModalOpen, isHearing]);

  useEffect(() => {
    if (isModalOpen && wasHearing && !isHearing) {
      setisModalOpen(false);
      setWasHearing(false);
    }
  }, [isHearing, isModalOpen, wasHearing]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 size={20} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="voice"
          options={{
            title: "Voice",
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => setisModalOpen(true)}
                style={[
                  styles.modalButton,
                  isModalOpen && styles.modalButtonActivated,
                ]}
              >
                <FontAwesome
                  name={isModalOpen ? "microphone" : "microphone-slash"}
                  size={24}
                  color={"white"}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="Automations"
          options={{
            title: "Automations",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 size={20} name="robot" color={color} />
            ),
          }}
        />
      </Tabs>
      <View>
        {isModalOpen && (
          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setisModalOpen(false)}
            title="Comandos de Voz"
          >
            <SpeechToText />
          </CustomModal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 25,
    backgroundColor: "#e74c3c",
  },
  modalButtonActivated: {
    backgroundColor: globalStyles.enabledColor,
  },
});
