import { Accelerometer, type AccelerometerMeasurement } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

export type GridPosition = {
  row: number;
  column: number;
};

const MOVE_THRESHOLD = 0.25;
const MOVE_COOLDOWN = 180;

export function useTiltMovement(maze: readonly string[], initialPosition: GridPosition) {
  const [position, setPosition] = useState(initialPosition);
  const lastMoveAt = useRef(0);

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | undefined;
    let active = true;

    const startSensor = async () => {
      const available = await Accelerometer.isAvailableAsync();
      if (!active || !available) return;

      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener((measurement) => {
        const now = Date.now();
        if (now - lastMoveAt.current < MOVE_COOLDOWN) return;

        const direction = getDirection(measurement);
        if (!direction) return;

        setPosition((current) => {
          const next = {
            row: current.row + direction.row,
            column: current.column + direction.column,
          };

          if (maze[next.row]?.[next.column] !== "0") return current;
          lastMoveAt.current = now;
          return next;
        });
      });
    };

    void startSensor();
    return () => {
      active = false;
      subscription?.remove();
    };
  }, [maze]);

  return position;
}

function getDirection({ x, y }: AccelerometerMeasurement) {
  if (Math.abs(x) < MOVE_THRESHOLD && Math.abs(y) < MOVE_THRESHOLD) return null;
  if (Math.abs(x) > Math.abs(y)) return { row: 0, column: x > 0 ? 1 : -1 };
  return { row: y > 0 ? -1 : 1, column: 0 };
}
