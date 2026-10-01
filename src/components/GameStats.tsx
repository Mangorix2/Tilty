import { StyleSheet, Text, View } from "react-native";

type GameStatsProps = {
  elapsedSeconds: number;
};

export function GameStats({ elapsedSeconds }: GameStatsProps) {
  return (
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
  );
}

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  stats: { alignItems: "center", flexDirection: "row", marginTop: 35 },
  statLabel: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  statValue: { color: "#F7F7FA", fontSize: 18, fontWeight: "700", marginTop: 5 },
  statDivider: { backgroundColor: "#242A41", height: 30, marginHorizontal: 24, width: 1 },
  progressTrack: { backgroundColor: "#20263B", borderRadius: 3, height: 5, marginLeft: "auto", overflow: "hidden", width: 84 },
  progressFill: { backgroundColor: "#B8FF5A", borderRadius: 3, height: 5, width: "35%" },
});
