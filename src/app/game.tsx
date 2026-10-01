import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

const maze = [
  "111111111",
  "100000001",
  "101111101",
  "101000101",
  "101011101",
  "101000001",
  "101111101",
  "100000001",
  "111111111",
];

export default function Game() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
          <Text style={styles.levelValue}>01 / 12</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pause game"
          onPress={() => undefined}
          style={styles.iconButton}
        >
          <Text style={styles.pauseIcon}>Ⅱ</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => router.push("/tilt-test")} style={styles.testLink}>
        <Text style={styles.testLinkText}>TEST TILT SENSOR →</Text>
      </Pressable>

      <View style={styles.stats}>
        <View>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={styles.statValue}>00:24</Text>
        </View>
        <View style={styles.statDivider} />
        <View>
          <Text style={styles.statLabel}>BEST</Text>
          <Text style={styles.statValue}>00:18</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.board}>
        <View style={styles.maze}>
          {maze.map((row, rowIndex) =>
            row.split("").map((cell, columnIndex) => (
              <View
                key={`${rowIndex}-${columnIndex}`}
                style={[styles.cell, cell === "1" ? styles.wall : styles.path]}
              >
                {rowIndex === 1 && columnIndex === 1 ? <View style={styles.player} /> : null}
                {rowIndex === 7 && columnIndex === 7 ? <View style={styles.goal} /> : null}
              </View>
            )),
          )}
        </View>
        <Text style={styles.boardHint}>TILT TO MOVE</Text>
      </View>

      <View style={styles.controls}>
        <Text style={styles.controlLabel}>OR USE CONTROLS</Text>
        <View style={styles.controlRow}>
          <Pressable style={styles.controlButton}>
            <Text style={styles.controlText}>←</Text>
          </Pressable>
          <View style={styles.verticalControls}>
            <Pressable style={styles.controlButton}>
              <Text style={styles.controlText}>↑</Text>
            </Pressable>
            <Pressable style={styles.controlButton}>
              <Text style={styles.controlText}>↓</Text>
            </Pressable>
          </View>
          <Pressable style={styles.controlButton}>
            <Text style={styles.controlText}>→</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#090B16", flex: 1, paddingHorizontal: 24, paddingTop: 22 },
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
  stats: { alignItems: "center", flexDirection: "row", marginTop: 35 },
  testLink: { alignSelf: "center", marginTop: 16 },
  testLinkText: { color: "#B8FF5A", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  statLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  statValue: { color: "#F7F7FA", fontSize: 18, fontWeight: "700", marginTop: 5 },
  statDivider: { backgroundColor: "#242A41", height: 30, marginHorizontal: 24, width: 1 },
  progressTrack: { backgroundColor: "#20263B", borderRadius: 3, height: 5, marginLeft: "auto", overflow: "hidden", width: 84 },
  progressFill: { backgroundColor: "#B8FF5A", borderRadius: 3, height: 5, width: "35%" },
  board: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#101426",
    borderColor: "#1E2740",
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 34,
    padding: 16,
    width: "100%",
  },
  maze: { aspectRatio: 1, flexDirection: "row", flexWrap: "wrap", width: "100%" },
  cell: { alignItems: "center", justifyContent: "center", width: `${100 / 9}%` },
  wall: { backgroundColor: "#59617A", borderColor: "#101426", borderWidth: 1 },
  path: { backgroundColor: "#171D32", borderColor: "#101426", borderWidth: 1 },
  player: { backgroundColor: "#B8FF5A", borderColor: "#E4FFC1", borderRadius: 8, borderWidth: 2, height: "55%", width: "55%" },
  goal: { borderColor: "#FF749E", borderRadius: 7, borderWidth: 2, height: "48%", width: "48%" },
  boardHint: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2, marginTop: 15 },
  controls: { alignItems: "center", marginTop: "auto", paddingBottom: 26 },
  controlLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: 14 },
  controlRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  verticalControls: { gap: 10 },
  controlButton: {
    alignItems: "center",
    backgroundColor: "#151A2D",
    borderColor: "#242A41",
    borderRadius: 14,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 58,
  },
  controlText: { color: "#F7F7FA", fontSize: 24 },
});
