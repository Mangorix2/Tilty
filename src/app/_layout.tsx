import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "#090B16" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="game" />
      <Stack.Screen name="tilt-test" />
    </Stack>
  );
}
