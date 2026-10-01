import { MazeBoard } from "@/components/MazeBoard";
import { GameProvider, useGame } from "@/context/GameContext";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

export default function Game() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const levelNumber = Number(level) || 1;

  return (
    <GameProvider level={levelNumber}>
      <GameScreen />
    </GameProvider>
  );
}

function GameScreen() {
  const {
    maze,
    playerPosition,
    goalPosition,
    elapsedSeconds,
    isStarted,
    isComplete,
    isDead,
    level,
    totalLevels,
    startGame,
    restartGame,
  } = useGame();
  const [showWinScreen, setShowWinScreen] = useState(false);

  useEffect(() => {
    if (!isComplete) {
      setShowWinScreen(false);
      return;
    }

    const timer = setTimeout(() => setShowWinScreen(true), 650);
    return () => clearTimeout(timer);
  }, [isComplete]);

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
          <Text style={styles.levelValue}>
            {level.toString().padStart(2, "0")} / {totalLevels}
          </Text>
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
        {isComplete ? "LEVEL COMPLETE" : isDead ? "YOU CRASHED" : isStarted ? "TILT YOUR DEVICE TO MOVE" : "PRESS START TO PLAY"}
      </Text>

      {isDead ? (
        <View style={styles.deathOverlay}>
          <View style={styles.deathCard}>
            <View style={styles.deathIcon}>
              <Text style={styles.deathIconText}>!</Text>
            </View>
            <Text style={styles.deathEyebrow}>LEVEL FAILED</Text>
            <Text style={styles.deathTitle}>Watch your step</Text>
            <Text style={styles.deathDescription}>You hit a dangerous wall. Try the level again.</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restart level"
              onPress={restartGame}
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            >
              <Text style={styles.retryButtonText}>TRY AGAIN</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back to home"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}
            >
              <Text style={styles.homeButtonText}>BACK TO HOME</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {showWinScreen ? (
        <View style={styles.winOverlay}>
          <View style={styles.winCard}>
            <View style={styles.winIcon}>
              <Text style={styles.winIconText}>✓</Text>
            </View>
            <Text style={styles.winEyebrow}>MAZE COMPLETE</Text>
            <Text style={styles.winTitle}>You made it!</Text>
            <Text style={styles.winDescription}>Great balance. Ready for the next challenge?</Text>
            <View style={styles.winStats}>
              <Text style={styles.winStatLabel}>TIME</Text>
              <Text style={styles.winStatValue}>{formatTime(elapsedSeconds)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={level < totalLevels ? "Play next level" : "Back to home"}
              onPress={() =>
                level < totalLevels
                  ? router.replace({ pathname: "/game", params: { level: String(level + 1) } })
                  : router.replace("/")
              }
              style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
            >
              <Text style={styles.nextButtonText}>
                {level < totalLevels ? "NEXT LEVEL" : "BACK TO HOME"}
              </Text>
              {level < totalLevels ? <Text style={styles.nextArrow}>→</Text> : null}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back to home"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}
            >
              <Text style={styles.homeButtonText}>BACK TO HOME</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
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
  winOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(4, 6, 15, 0.86)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    padding: 24,
    position: "absolute",
    right: 0,
    top: 0,
  },
  deathOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(4, 6, 15, 0.86)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    padding: 24,
    position: "absolute",
    right: 0,
    top: 0,
  },
  deathCard: {
    alignItems: "center",
    backgroundColor: "#151A2D",
    borderColor: "#5C2638",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    width: "100%",
  },
  deathIcon: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  deathIconText: { color: "#FFF1F2", fontSize: 34, fontWeight: "800" },
  deathEyebrow: { color: "#FB7185", fontSize: 11, fontWeight: "700", letterSpacing: 2.5, marginTop: 20 },
  deathTitle: { color: "#F7F7FA", fontSize: 30, fontWeight: "800", marginTop: 8 },
  deathDescription: { color: "#8A8EA4", fontSize: 14, lineHeight: 21, marginTop: 10, textAlign: "center" },
  retryButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  retryButtonText: { color: "#FFF1F2", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  winCard: {
    alignItems: "center",
    backgroundColor: "#151A2D",
    borderColor: "#2A3452",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    width: "100%",
  },
  winIcon: {
    alignItems: "center",
    backgroundColor: "#4ADE80",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  winIconText: { color: "#090B16", fontSize: 34, fontWeight: "800" },
  winEyebrow: { color: "#B8FF5A", fontSize: 11, fontWeight: "700", letterSpacing: 2.5, marginTop: 20 },
  winTitle: { color: "#F7F7FA", fontSize: 30, fontWeight: "800", marginTop: 8 },
  winDescription: { color: "#8A8EA4", fontSize: 14, lineHeight: 21, marginTop: 10, textAlign: "center" },
  winStats: { alignItems: "center", borderColor: "#2A3452", borderTopWidth: 1, marginTop: 24, paddingTop: 16, width: "100%" },
  winStatLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  winStatValue: { color: "#F7F7FA", fontSize: 22, fontWeight: "800", marginTop: 4 },
  nextButton: {
    alignItems: "center",
    backgroundColor: "#B8FF5A",
    borderRadius: 14,
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  nextButtonText: { color: "#090B16", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  nextArrow: { color: "#090B16", fontSize: 24, fontWeight: "300", marginLeft: 14 },
  pressed: { opacity: 0.8 },
  homeButton: { paddingVertical: 16 },
  homeButtonText: { color: "#8A8EA4", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 },
});
