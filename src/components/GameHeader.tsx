import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type GameHeaderProps = {
  level: number;
  totalLevels: number;
  isPaused: boolean;
  onPause: () => void;
};

export function GameHeader({ level, totalLevels, isPaused, onPause }: GameHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back to home"
        onPress={() => router.back()}
        style={styles.iconButton}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <View style={styles.level}>
        <Text style={styles.levelLabel}>CURRENT LEVEL</Text>
        <Text style={styles.levelValue}>
          {level.toString().padStart(2, "0")} / {totalLevels}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPaused ? "Resume game" : "Pause game"}
        onPress={onPause}
        style={styles.iconButton}
      >
        <Text style={styles.pauseIcon}>{isPaused ? "▶" : "Ⅱ"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#151A2D",
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  backIcon: { color: "#F7F7FA", fontSize: 34, fontWeight: "300", lineHeight: 38 },
  pauseIcon: { color: "#F7F7FA", fontSize: 18, fontWeight: "800", letterSpacing: -2 },
  level: { alignItems: "center" },
  levelLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  levelValue: { color: "#F7F7FA", fontSize: 20, fontWeight: "800", marginTop: 5 },
});
