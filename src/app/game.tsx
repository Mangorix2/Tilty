import { GameHeader } from "@/components/GameHeader";
import { GameOverlay } from "@/components/GameOverlay";
import { GameStats } from "@/components/GameStats";
import { MazeBoard } from "@/components/MazeBoard";
import { GameProvider, useGame } from "@/context/GameContext";
import { useProgress } from "@/context/ProgressContext";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Game() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const levelNumber = Number(level) || 1;
  const { isLevelUnlocked } = useProgress();

  useEffect(() => {
    if (!isLevelUnlocked(levelNumber)) router.replace("/levels");
  }, [isLevelUnlocked, levelNumber]);

  if (!isLevelUnlocked(levelNumber)) return null;

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
    isPaused,
    isComplete,
    isDead,
    collisionType,
    level,
    totalLevels,
    startGame,
    restartGame,
    pauseGame,
    resumeGame,
  } = useGame();
  const { getBestTime, recordResult, unlockNextLevel } = useProgress();
  const bestTime = getBestTime(level);
  const stars = getStarsForTime(elapsedSeconds, level);
  const [showWinScreen, setShowWinScreen] = useState(false);

  useEffect(() => {
    if (!isDead || !collisionType) return;

    if (collisionType === "hole" && level > 1) {
      router.replace({ pathname: "/game", params: { level: String(level - 1) } });
      return;
    }

    restartGame();
  }, [collisionType, isDead, level, restartGame]);

  useEffect(() => {
    if (isComplete) {
      unlockNextLevel(level);
      recordResult(level, elapsedSeconds, stars);
    }
  }, [elapsedSeconds, isComplete, level, recordResult, stars, unlockNextLevel]);

  useEffect(() => {
    if (!isComplete) return;

    const timer = setTimeout(() => setShowWinScreen(true), 650);
    return () => clearTimeout(timer);
  }, [isComplete]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GameHeader
        level={level}
        totalLevels={totalLevels}
        isPaused={isPaused}
        onPause={isPaused ? resumeGame : pauseGame}
      />
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
      <GameStats elapsedSeconds={elapsedSeconds} bestTime={bestTime} />
      <MazeBoard maze={maze} playerPosition={playerPosition} goalPosition={goalPosition} />
      <Text style={styles.tiltHint}>
        {isComplete
          ? "LEVEL COMPLETE"
          : isDead
            ? "YOU CRASHED"
            : isStarted
              ? "TILT YOUR DEVICE TO MOVE"
              : "PRESS START TO PLAY"}
      </Text>
      {isDead ? (
        <GameOverlay
          type="death"
          elapsedSeconds={elapsedSeconds}
          level={level}
          totalLevels={totalLevels}
          stars={stars}
          bestTime={bestTime}
          onRestart={restartGame}
        />
      ) : null}
      {showWinScreen && isComplete ? (
        <GameOverlay
          type="win"
          elapsedSeconds={elapsedSeconds}
          level={level}
          totalLevels={totalLevels}
          stars={stars}
          bestTime={bestTime}
          onRestart={restartGame}
        />
      ) : null}
      {isPaused ? (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseEyebrow}>GAME PAUSED</Text>
            <Text style={styles.pauseTitle}>Take a breath</Text>
            <Pressable onPress={resumeGame} style={styles.resumeButton}>
              <Text style={styles.resumeButtonText}>RESUME</Text>
            </Pressable>
            <Pressable onPress={restartGame} style={styles.pauseRestart}>
              <Text style={styles.pauseRestartText}>RESTART LEVEL</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function getStarsForTime(elapsedSeconds: number, level: number) {
  if (elapsedSeconds <= Math.max(15, level * 3)) return 3;
  if (elapsedSeconds <= Math.max(30, level * 6)) return 2;
  return 1;
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#090B16", flex: 1, paddingHorizontal: 24, paddingTop: 22 },
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
  tiltHint: {
    color: "#62667C",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: "auto",
    paddingBottom: 28,
    textAlign: "center",
  },
  pauseOverlay: {
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
  pauseCard: {
    alignItems: "center",
    backgroundColor: "#151A2D",
    borderColor: "#2A3452",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    width: "100%",
  },
  pauseEyebrow: { color: "#B8FF5A", fontSize: 11, fontWeight: "700", letterSpacing: 2.5 },
  pauseTitle: { color: "#F7F7FA", fontSize: 28, fontWeight: "800", marginTop: 8 },
  resumeButton: {
    alignItems: "center",
    backgroundColor: "#B8FF5A",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  resumeButtonText: { color: "#090B16", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  pauseRestart: { paddingVertical: 16 },
  pauseRestartText: { color: "#8A8EA4", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 },
});
