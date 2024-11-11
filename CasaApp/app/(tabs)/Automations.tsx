import AutomationCard from "@/components/automations/automation-card";
import { Container } from "@/components/ui/container";
import DottedButton from "@/components/ui/dotted-button";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

const AUTOMATIONS_MOCK = [
  {
    id: 1,
    name: "Movie night 🍿",
    description: "Turn off living lights",
  },
  {
    id: 2,
    name: "Study 📚",
    description: "Bedroom desktop light on",
  },
];

export default function Home() {
  return (
    <Container>
      <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Automations 🤖
      </Text>
      <View style={{ gap: 8 }}>
        {AUTOMATIONS_MOCK.map((aut, index) => (
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
