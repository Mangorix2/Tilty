import { MazeBoard } from "@/components/MazeBoard";
import { GameProvider, useGame } from "@/context/GameContext";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Game() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}

function GameScreen() {
  const { maze, playerPosition, goalPosition, elapsedSeconds, isStarted, isComplete, startGame } =
    useGame();
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
      {!isStarted ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start level"
          onPress={startGame}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>START LEVEL</Text>
        </Pressable>
      ) : null}

      <View style={styles.stats}>
        <View>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={styles.statValue}>{formatTime(elapsedSeconds)}</Text>
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

      <MazeBoard maze={maze} playerPosition={playerPosition} goalPosition={goalPosition} />

      <Text style={styles.tiltHint}>
        {isComplete ? "LEVEL COMPLETE" : isStarted ? "TILT YOUR DEVICE TO MOVE" : "PRESS START TO PLAY"}
      </Text>
    </View>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
  startButton: {
    alignSelf: "center",
    backgroundColor: "#B8FF5A",
    borderRadius: 14,
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  startButtonText: { color: "#090B16", fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  statLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  statValue: { color: "#F7F7FA", fontSize: 18, fontWeight: "700", marginTop: 5 },
  statDivider: { backgroundColor: "#242A41", height: 30, marginHorizontal: 24, width: 1 },
  progressTrack: { backgroundColor: "#20263B", borderRadius: 3, height: 5, marginLeft: "auto", overflow: "hidden", width: 84 },
  progressFill: { backgroundColor: "#B8FF5A", borderRadius: 3, height: 5, width: "35%" },
  tiltHint: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2, marginTop: "auto", paddingBottom: 28, textAlign: "center" },
});
