import { StyleSheet, Text, View } from "react-native";
import type { GridPosition } from "@/hooks/useTiltMovement";

type MazeBoardProps = {
  maze: readonly string[];
  playerPosition: GridPosition;
  goalPosition: GridPosition;
};

export function MazeBoard({ maze, playerPosition, goalPosition }: MazeBoardProps) {
  return (
    <View style={styles.board}>
      <View style={styles.maze}>
        {maze.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.mazeRow}>
            {row.split("").map((cell, columnIndex) => (
              <View
                key={`${rowIndex}-${columnIndex}`}
                style={[styles.cell, cell === "1" ? styles.wall : styles.path]}
              >
                {playerPosition.row === rowIndex && playerPosition.column === columnIndex ? (
                  <View style={styles.player} />
                ) : null}
                {goalPosition.row === rowIndex && goalPosition.column === columnIndex ? (
                  <View style={styles.goal} />
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.boardHint}>TILT TO MOVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  maze: { aspectRatio: 1, flexDirection: "column", width: "100%" },
  mazeRow: { flex: 1, flexDirection: "row" },
  cell: { alignItems: "center", flex: 1, justifyContent: "center" },
  wall: { backgroundColor: "#59617A", borderColor: "#101426", borderWidth: 1 },
  path: { backgroundColor: "#171D32", borderColor: "#101426", borderWidth: 1 },
  player: {
    backgroundColor: "#B8FF5A",
    borderColor: "#E4FFC1",
    borderRadius: 8,
    borderWidth: 2,
    height: "55%",
    width: "55%",
  },
  goal: { borderColor: "#FF749E", borderRadius: 7, borderWidth: 2, height: "48%", width: "48%" },
  boardHint: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2, marginTop: 15 },
});
