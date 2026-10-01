import { createContext, useContext, type PropsWithChildren } from "react";
import { useTiltMovement, type GridPosition } from "@/hooks/useTiltMovement";
import { GOAL_POSITION, MAZE, START_POSITION } from "@/models/maze";

type GameContextValue = {
  maze: typeof MAZE;
  playerPosition: GridPosition;
  goalPosition: GridPosition;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const playerPosition = useTiltMovement(MAZE, START_POSITION);

  return (
    <GameContext.Provider value={{ maze: MAZE, playerPosition, goalPosition: GOAL_POSITION }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside a GameProvider");
  return context;
}
