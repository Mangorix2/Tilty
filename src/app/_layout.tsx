import { Stack } from "expo-router";
import { ProgressProvider } from "@/context/ProgressContext";

export default function RootLayout() {
  return (
    <ProgressProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#090B16" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="game" />
        <Stack.Screen name="tilt-test" />
      </Stack>
    </ProgressProvider>
  );
}
