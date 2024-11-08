import GlobalStyles from "@/Utils/globalStyles";
import { ActivityIndicator } from "react-native";

interface Props {
  size?: "small" | "large";
  color?: string;
}

export default function Loader({
  color = GlobalStyles.enabledColor,
  size = "large",
}: Props) {
  return <ActivityIndicator size={size} color={color} />;
}
