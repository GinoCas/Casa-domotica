import AutomationCard from "@/components/automations/automation-card";
import { Container } from "@/components/ui/container";
import DottedButton from "@/components/ui/dotted-button";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import AutomationsData from "@/stores/automations.json";
import useAutomationStore from "@/stores/useAutomationStore";
import { useEffect } from "react";

export default function Home() {
  const { automations, handleLoadAutomations } = useAutomationStore();

  useEffect(() => {
    handleLoadAutomations(AutomationsData);
  }, []);
  return (
    <Container>
      <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Automations 🤖
      </Text>
      <View style={{ gap: 8 }}>
        {automations.map((aut, index) => (
          <AutomationCard key={index} automation={aut} />
        ))}
      </View>
      <DottedButton
        label="Add Automation"
        icon={
          <Feather name="plus" size={24} color={GlobalStyles.enabledColor} />
        }
      />
    </Container>
  );
}
