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
  isPaused: boolean;
  isComplete: boolean;
  isDead: boolean;
  collisionType: "hole" | "hazardWall" | null;
  pauseGame: () => void;
  startGame: () => void;
  restartGame: () => void;
  resumeGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = PropsWithChildren<{ level?: number }>;

export function GameProvider({ children, level: requestedLevel = 1 }: GameProviderProps) {
  const level = Math.min(Math.max(Math.floor(requestedLevel), 1), TOTAL_LEVELS);
  const levelData = getLevel(level);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const movement = useTiltMovement(
    levelData.maze,
    levelData.start,
    isStarted && !isPaused && !isComplete,
    resetKey,
  );
  const playerPosition = movement.position;
  const startedAt = useRef<number | null>(null);
  const pausedAt = useRef<number | null>(null);
  const pausedDuration = useRef(0);
  const reachedGoal =
    Math.hypot(playerPosition.x - levelData.goal.x, playerPosition.y - levelData.goal.y) < 0.35;

  const startGame = useCallback(() => {
    if (isStarted || isComplete) return;
    startedAt.current = Date.now();
    pausedAt.current = null;
    pausedDuration.current = 0;
    setIsStarted(true);
    setIsPaused(false);
  }, [isComplete, isStarted]);
  const pauseGame = useCallback(() => {
    if (!isStarted || isPaused || isComplete) return;
    pausedAt.current = Date.now();
    setIsPaused(true);
  }, [isComplete, isPaused, isStarted]);
  const resumeGame = useCallback(() => {
    if (!isPaused) return;
    if (pausedAt.current !== null) {
      pausedDuration.current += Date.now() - pausedAt.current;
    }
    pausedAt.current = null;
    setIsPaused(false);
  }, [isPaused]);
  const restartGame = useCallback(() => {
    startedAt.current = Date.now();
    pausedAt.current = null;
    pausedDuration.current = 0;
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsComplete(false);
    setResetKey((current) => current + 1);
    setIsStarted(true);
  }, []);

  useEffect(() => {
    if (!reachedGoal || isComplete) return;

    setIsComplete(true);
    if (startedAt.current !== null) {
      setElapsedSeconds(
        Math.floor((Date.now() - startedAt.current - pausedDuration.current) / 1000),
      );
    }
  }, [isComplete, reachedGoal]);

  useEffect(() => {
    const startTime = startedAt.current;
    if (!isStarted || startTime === null || isComplete || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime - pausedDuration.current) / 1000));
    }, 250);

    return () => clearInterval(timer);
  }, [isStarted, isComplete, isPaused]);

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
        isPaused,
        isComplete,
        isDead: movement.isDead,
        collisionType: movement.collisionType,
        pauseGame,
        startGame,
        restartGame,
        resumeGame,
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
