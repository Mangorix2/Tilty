import type { GridPosition } from "@/hooks/useTiltMovement";

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

export const START_POSITION: GridPosition = { row: 1, column: 1 };
export const GOAL_POSITION: GridPosition = { row: 7, column: 7 };
