import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push("/room/living");
  }, [router]);

  return <></>;
}
