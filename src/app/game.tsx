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
    isComplete,
    isDead,
    collisionType,
    level,
    totalLevels,
    startGame,
    restartGame,
  } = useGame();
  const { unlockNextLevel } = useProgress();
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
    if (isComplete) unlockNextLevel(level);
  }, [isComplete, level, unlockNextLevel]);

  useEffect(() => {
    if (!isComplete) return;

    const timer = setTimeout(() => setShowWinScreen(true), 650);
    return () => clearTimeout(timer);
  }, [isComplete]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GameHeader level={level} totalLevels={totalLevels} />
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
      <GameStats elapsedSeconds={elapsedSeconds} />
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
          onRestart={restartGame}
        />
      ) : null}
      {showWinScreen && isComplete ? (
        <GameOverlay
          type="win"
          elapsedSeconds={elapsedSeconds}
          level={level}
          totalLevels={totalLevels}
          onRestart={restartGame}
        />
      ) : null}
    </View>
  );
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
});
