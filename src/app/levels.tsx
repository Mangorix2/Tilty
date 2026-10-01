import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TOTAL_LEVELS } from "@/models/maze";
import { useProgress } from "@/context/ProgressContext";

export default function Levels() {
  const { highestUnlockedLevel, isLevelUnlocked } = useProgress();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.eyebrow}>TILTY</Text>
          <Text style={styles.title}>Choose a level</Text>
        </View>
        <View style={styles.levelCount}>
          <Text style={styles.levelCountValue}>{highestUnlockedLevel}</Text>
          <Text style={styles.levelCountLabel}>UNLOCKED</Text>
        </View>
      </View>

      <Text style={styles.description}>Complete a level to unlock the next challenge.</Text>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {Array.from({ length: TOTAL_LEVELS }, (_, index) => {
          const level = index + 1;
          const unlocked = isLevelUnlocked(level);

          return (
            <Pressable
              key={level}
              accessibilityRole="button"
              accessibilityLabel={unlocked ? `Play level ${level}` : `Level ${level} locked`}
              accessibilityState={{ disabled: !unlocked }}
              disabled={!unlocked}
              onPress={() => router.push({ pathname: "/game", params: { level: String(level) } })}
              style={({ pressed }) => [
                styles.levelCard,
                !unlocked && styles.lockedCard,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.levelNumber, !unlocked && styles.lockedText]}>
                {level.toString().padStart(2, "0")}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardLabel, !unlocked && styles.lockedText]}>
                  {unlocked ? "PLAY LEVEL" : "LOCKED"}
                </Text>
                <Text style={[styles.cardIcon, !unlocked && styles.lockedText]}>
                  {unlocked ? "→" : "•"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#090B16", flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  header: { alignItems: "center", flexDirection: "row" },
  backButton: {
    alignItems: "center",
    backgroundColor: "#151A2D",
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  backIcon: { color: "#F7F7FA", fontSize: 34, fontWeight: "300", lineHeight: 38 },
  headerTitle: { flex: 1, marginLeft: 16 },
  eyebrow: { color: "#B8FF5A", fontSize: 10, fontWeight: "700", letterSpacing: 2.5 },
  title: { color: "#F7F7FA", fontSize: 25, fontWeight: "800", marginTop: 4 },
  levelCount: { alignItems: "center" },
  levelCountValue: { color: "#B8FF5A", fontSize: 20, fontWeight: "800" },
  levelCountLabel: { color: "#62667C", fontSize: 8, fontWeight: "700", letterSpacing: 1 },
  description: { color: "#8A8EA4", fontSize: 14, lineHeight: 21, marginTop: 30 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 32, paddingTop: 24 },
  levelCard: {
    backgroundColor: "#151A2D",
    borderColor: "#2A3452",
    borderRadius: 18,
    borderWidth: 1,
    height: 132,
    justifyContent: "space-between",
    padding: 18,
    width: "48%",
  },
  lockedCard: { backgroundColor: "#101322", borderColor: "#1A2035", opacity: 0.7 },
  levelNumber: { color: "#F7F7FA", fontSize: 38, fontWeight: "800" },
  cardFooter: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  cardLabel: { color: "#B8FF5A", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  cardIcon: { color: "#B8FF5A", fontSize: 22, fontWeight: "300" },
  lockedText: { color: "#62667C" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
