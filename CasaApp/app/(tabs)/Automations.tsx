import AutomationCard from "@/components/automations/automation-card";
import { Container } from "@/components/ui/container";
import DottedButton from "@/components/ui/dotted-button";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";
import useAutomation from "@/hooks/useAutomations";
import { useRouter } from "expo-router";

export default function Home() {
  const { automations, getAutomationById, createAutomation } = useAutomation();
  const router = useRouter();

  const handleAutomationPress = (automationId: number) => {
    router.push({
      pathname: `/automation/${automationId}`,
    });
  };
  return (
    <Container>
      <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Automations 🤖
      </Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={automations}
          keyExtractor={(automation) => automation.id.toString()}
          renderItem={({ item }) => (
            <AutomationCard
              onPress={() => handleAutomationPress(item.id)}
              key={item.id}
              automation={item}
            />
          )}
          contentContainerStyle={{ gap: 8 }}
        />
      </View>
      <DottedButton
        label="Add Automation"
        icon={
          <Feather name="plus" size={24} color={GlobalStyles.enabledColor} />
        }
        onPress={() => handleAutomationPress(-1)}
      />
    </Container>
  );
}
