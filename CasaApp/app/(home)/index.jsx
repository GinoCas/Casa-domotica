import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <Link href="/living">Homee</Link>
      <Text>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero esse
        hic quaerat vel quisquam fuga.
      </Text>
    </View>
  );
}
