import type { MazePosition } from "@/hooks/useTiltMovement";

export const MAZE = [
  "111111111",
  "100000001",
  "101111101",
  "101000101",
  "101011101",
  "101000001",
  "101111101",
  "100000001",
  "111111111",
] as const;

export const START_POSITION: MazePosition = { x: 1.5, y: 1.5 };
export const GOAL_POSITION: MazePosition = { x: 7.5, y: 7.5 };
