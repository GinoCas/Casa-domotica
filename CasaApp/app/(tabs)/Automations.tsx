import AutomationCard from "@/components/automations/automation-card";
import { Container } from "@/components/ui/container";
import DottedButton from "@/components/ui/dotted-button";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import useAutomation from "@/hooks/useAutomations";

export default function Home() {
  const { automations } = useAutomation();

  return (
    <Container>
      <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Automations 🤖
      </Text>
      <View style={{ gap: 8 }}>
        {automations.map((aut) => (
          <AutomationCard key={aut.id} automation={aut} />
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
