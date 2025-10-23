import AutomationCard from "@/components/automations/automation-card";
import { Container } from "@/components/ui/container";
import DottedButton from "@/components/ui/dotted-button";
import GlobalStyles from "@/Utils/globalStyles";
import { Feather } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";
import useAutomation from "@/hooks/useAutomations";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Automation } from "@/src/core/entities/Automation";

export default function Home() {
  const { automations } = useAutomation();
  const router = useRouter();

  const handleAutomationPress = useCallback(
    (automationId: number) => {
      router.push({
        pathname: `/automation/${automationId}`,
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Automation }) => (
      <AutomationCard
        onPress={() => handleAutomationPress(item.id)}
        key={item.id}
        automation={item}
      />
    ),
    [handleAutomationPress],
  );

  return (
    <Container>
      <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Automatizaciones 🤖
      </Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={automations}
          keyExtractor={(automation) => automation.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 8 }}
        />
      </View>
      <DottedButton
        label="Añadir automatización"
        icon={
          <Feather name="plus" size={24} color={GlobalStyles.enabledColor} />
        }
        onPress={() => {
          if (automations.length === 20) {
            alert("Alcanzaste el limite permitido de automatizaciones (20).");
          } else {
            handleAutomationPress(-1);
          }
        }}
      />
    </Container>
  );
}
