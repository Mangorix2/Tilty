import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { useTiltMovement, type MazePosition } from "@/hooks/useTiltMovement";
import { GOAL_POSITION, MAZE, START_POSITION } from "@/models/maze";

type GameContextValue = {
  maze: typeof MAZE;
  playerPosition: MazePosition;
  goalPosition: MazePosition;
  elapsedSeconds: number;
  isStarted: boolean;
  isComplete: boolean;
  startGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const [isStarted, setIsStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const playerPosition = useTiltMovement(MAZE, START_POSITION, isStarted && !isComplete);
  const startedAt = useRef<number | null>(null);
  const reachedGoal =
    Math.hypot(playerPosition.x - GOAL_POSITION.x, playerPosition.y - GOAL_POSITION.y) < 0.35;

  const startGame = () => {
    if (isStarted || isComplete) return;
    startedAt.current = Date.now();
    setIsStarted(true);
  };

  useEffect(() => {
    if (!reachedGoal || isComplete) return;

    setIsComplete(true);
    if (startedAt.current !== null) {
      setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    }
  }, [isComplete, reachedGoal]);

  useEffect(() => {
    const startTime = startedAt.current;
    if (!isStarted || startTime === null || isComplete) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 250);

    return () => clearInterval(timer);
  }, [isStarted, isComplete]);

  return (
    <GameContext.Provider
      value={{
        maze: MAZE,
        playerPosition,
        goalPosition: GOAL_POSITION,
        elapsedSeconds,
        isStarted,
        isComplete,
        startGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside a GameProvider");
  return context;
}
