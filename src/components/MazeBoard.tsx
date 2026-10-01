import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MazePosition } from "@/hooks/useTiltMovement";

type MazeBoardProps = {
  maze: readonly string[];
  playerPosition: MazePosition;
  goalPosition: MazePosition;
};

export function MazeBoard({ maze, playerPosition, goalPosition }: MazeBoardProps) {
  const [boardSize, setBoardSize] = useState(0);
  const cellSize = boardSize / maze[0].length;
  const ballSize = cellSize * 0.4;

  return (
    <View style={styles.board}>
      <View
        onLayout={({ nativeEvent }) => setBoardSize(nativeEvent.layout.width)}
        style={styles.maze}
      >
        {maze.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.mazeRow}>
            {row.split("").map((cell, columnIndex) => (
              <View
                key={`${rowIndex}-${columnIndex}`}
                style={[
                  styles.cell,
                  cell === "1"
                    ? styles.wall
                    : cell === "2"
                      ? styles.hole
                      : cell === "3"
                        ? styles.hazard
                        : styles.path,
                ]}
              >
              </View>
            ))}
          </View>
        ))}
        {boardSize > 0 ? (
          <>
            <View
              style={[
                styles.player,
                {
                  height: ballSize,
                  left: playerPosition.x * cellSize - ballSize / 2,
                  top: playerPosition.y * cellSize - ballSize / 2,
                  width: ballSize,
                },
              ]}
            />
            <View
              style={[
                styles.goal,
                {
                  height: ballSize * 0.9,
                  left: goalPosition.x * cellSize - (ballSize * 0.9) / 2,
                  top: goalPosition.y * cellSize - (ballSize * 0.9) / 2,
                  width: ballSize * 0.9,
                },
              ]}
            />
          </>
        ) : null}
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
  hole: { backgroundColor: "#05060C", borderColor: "#101426", borderWidth: 1 },
  hazard: { backgroundColor: "#A83B5C", borderColor: "#FF749E", borderWidth: 1 },
  player: {
    backgroundColor: "#B8FF5A",
    borderColor: "#E4FFC1",
    borderRadius: 100,
    borderWidth: 2,
    position: "absolute",
  },
  goal: { borderColor: "#FF749E", borderRadius: 100, borderWidth: 2, position: "absolute" },
  boardHint: { color: "#62667C", fontSize: 10, fontWeight: "700", letterSpacing: 2, marginTop: 15 },
});
