import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatTime } from "@/components/GameStats";

type GameOverlayProps = {
  type: "death" | "win";
  elapsedSeconds: number;
  level: number;
  totalLevels: number;
  stars: number;
  bestTime: number | null;
  onRestart: () => void;
};

export function GameOverlay({
  type,
  elapsedSeconds,
  level,
  totalLevels,
  stars,
  bestTime,
  onRestart,
}: GameOverlayProps) {
  const isWin = type === "win";

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, isWin ? styles.winCard : styles.deathCard]}>
        <View style={[styles.icon, isWin ? styles.winIcon : styles.deathIcon]}>
          <Text style={[styles.iconText, isWin ? styles.winIconText : styles.deathIconText]}>
            {isWin ? "✓" : "!"}
          </Text>
        </View>
        <Text style={[styles.eyebrow, isWin ? styles.winEyebrow : styles.deathEyebrow]}>
          {isWin ? "MAZE COMPLETE" : "LEVEL FAILED"}
        </Text>
        <Text style={styles.title}>{isWin ? "You made it!" : "Watch your step"}</Text>
        <Text style={styles.description}>
          {isWin
            ? "Great balance. Ready for the next challenge?"
            : "You hit a dangerous wall. Try the level again."}
        </Text>

        {isWin ? (
          <View style={styles.winStats}>
            <Text style={styles.stars}>{Array.from({ length: 3 }, (_, index) => index < stars ? "★" : "☆").join(" ")}</Text>
            <Text style={styles.winStatLabel}>TIME</Text>
            <Text style={styles.winStatValue}>{formatTime(elapsedSeconds)}</Text>
            {bestTime !== null && bestTime < elapsedSeconds ? (
              <Text style={styles.bestTime}>BEST: {formatTime(bestTime)}</Text>
            ) : null}
          </View>
        ) : (
          <ActionButton label="TRY AGAIN" onPress={onRestart} variant="danger" />
        )}

        {isWin ? (
          <ActionButton
            label={level < totalLevels ? "NEXT LEVEL" : "BACK TO HOME"}
            onPress={() =>
              level < totalLevels
                ? router.replace({ pathname: "/game", params: { level: String(level + 1) } })
                : router.replace("/")
            }
            variant="primary"
            showArrow={level < totalLevels}
          />
        ) : null}
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
  );
}

function ActionButton({
  label,
  onPress,
  variant,
  showArrow = false,
}: {
  label: string;
  onPress: () => void;
  variant: "danger" | "primary";
  showArrow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variant === "danger" ? styles.retryButton : styles.nextButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={variant === "danger" ? styles.retryButtonText : styles.nextButtonText}>
        {label}
      </Text>
      {showArrow ? <Text style={styles.nextArrow}>→</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
  card: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    width: "100%",
  },
  deathCard: { backgroundColor: "#151A2D", borderColor: "#5C2638" },
  winCard: { backgroundColor: "#151A2D", borderColor: "#2A3452" },
  icon: { alignItems: "center", borderRadius: 30, height: 60, justifyContent: "center", width: 60 },
  deathIcon: { backgroundColor: "#EF4444" },
  winIcon: { backgroundColor: "#4ADE80" },
  iconText: { fontSize: 34, fontWeight: "800" },
  deathIconText: { color: "#FFF1F2" },
  winIconText: { color: "#090B16" },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 2.5, marginTop: 20 },
  deathEyebrow: { color: "#FB7185" },
  winEyebrow: { color: "#B8FF5A" },
  title: { color: "#F7F7FA", fontSize: 30, fontWeight: "800", marginTop: 8 },
  description: { color: "#8A8EA4", fontSize: 14, lineHeight: 21, marginTop: 10, textAlign: "center" },
  actionButton: { alignItems: "center", borderRadius: 14, flexDirection: "row", height: 56, justifyContent: "center", marginTop: 24, width: "100%" },
  retryButton: { backgroundColor: "#EF4444" },
  nextButton: { backgroundColor: "#B8FF5A" },
  retryButtonText: { color: "#FFF1F2", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  nextButtonText: { color: "#090B16", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  nextArrow: { color: "#090B16", fontSize: 24, fontWeight: "300", marginLeft: 14 },
  winStats: { alignItems: "center", borderColor: "#2A3452", borderTopWidth: 1, marginTop: 24, paddingTop: 16, width: "100%" },
  stars: { color: "#B8FF5A", fontSize: 26, letterSpacing: 4, marginBottom: 12 },
  winStatLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  winStatValue: { color: "#F7F7FA", fontSize: 22, fontWeight: "800", marginTop: 4 },
  bestTime: { color: "#8A8EA4", fontSize: 11, fontWeight: "700", marginTop: 8 },
  homeButton: { paddingVertical: 16 },
  homeButtonText: { color: "#8A8EA4", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 },
  pressed: { opacity: 0.8 },
});
