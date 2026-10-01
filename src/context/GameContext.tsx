import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useTiltMovement, type MazePosition } from "@/hooks/useTiltMovement";
import { getLevel, TOTAL_LEVELS, type MazeLevel } from "@/models/maze";

type GameContextValue = {
  maze: MazeLevel["maze"];
  level: number;
  totalLevels: number;
  playerPosition: MazePosition;
  goalPosition: MazePosition;
  elapsedSeconds: number;
  isStarted: boolean;
  isComplete: boolean;
  isDead: boolean;
  collisionType: "hole" | "hazardWall" | null;
  startGame: () => void;
  restartGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = PropsWithChildren<{ level?: number }>;

export function GameProvider({ children, level: requestedLevel = 1 }: GameProviderProps) {
  const level = Math.min(Math.max(Math.floor(requestedLevel), 1), TOTAL_LEVELS);
  const levelData = getLevel(level);
  const [isStarted, setIsStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const movement = useTiltMovement(
    levelData.maze,
    levelData.start,
    isStarted && !isComplete,
    resetKey,
  );
  const playerPosition = movement.position;
  const startedAt = useRef<number | null>(null);
  const reachedGoal =
    Math.hypot(playerPosition.x - levelData.goal.x, playerPosition.y - levelData.goal.y) < 0.35;

  const startGame = useCallback(() => {
    if (isStarted || isComplete) return;
    startedAt.current = Date.now();
    setIsStarted(true);
  }, [isComplete, isStarted]);
  const restartGame = useCallback(() => {
    startedAt.current = Date.now();
    setElapsedSeconds(0);
    setIsComplete(false);
    setResetKey((current) => current + 1);
    setIsStarted(true);
  }, []);

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
        maze: levelData.maze,
        level,
        totalLevels: TOTAL_LEVELS,
        playerPosition,
        goalPosition: levelData.goal,
        elapsedSeconds,
        isStarted,
        isComplete,
        isDead: movement.isDead,
        collisionType: movement.collisionType,
        startGame,
        restartGame,
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
