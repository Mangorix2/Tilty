import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";
import { TOTAL_LEVELS } from "@/models/maze";

type ProgressContextValue = {
  highestUnlockedLevel: number;
  getBestTime: (level: number) => number | null;
  getStars: (level: number) => number;
  isLevelUnlocked: (level: number) => boolean;
  recordResult: (level: number, elapsedSeconds: number, stars: number) => void;
  unlockNextLevel: (completedLevel: number) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [bestTimes, setBestTimes] = useState<Record<number, number>>({});
  const [stars, setStars] = useState<Record<number, number>>({});

  const unlockNextLevel = useCallback((completedLevel: number) => {
    const nextLevel = Math.min(completedLevel + 1, TOTAL_LEVELS);
    setHighestUnlockedLevel((current) => Math.max(current, nextLevel));
  }, []);

  const recordResult = useCallback((level: number, elapsedSeconds: number, earnedStars: number) => {
    setBestTimes((current) => {
      const previous = current[level];
      if (previous !== undefined && previous <= elapsedSeconds) return current;
      return { ...current, [level]: elapsedSeconds };
    });
    setStars((current) => ({
      ...current,
      [level]: Math.max(current[level] ?? 0, earnedStars),
    }));
  }, []);

  const getBestTime = useCallback((level: number) => bestTimes[level] ?? null, [bestTimes]);
  const getStars = useCallback((level: number) => stars[level] ?? 0, [stars]);

  const isLevelUnlocked = useCallback(
    (level: number) => level >= 1 && level <= highestUnlockedLevel,
    [highestUnlockedLevel],
  );

  return (
    <ProgressContext.Provider
      value={{
        highestUnlockedLevel,
        getBestTime,
        getStars,
        isLevelUnlocked,
        recordResult,
        unlockNextLevel,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
