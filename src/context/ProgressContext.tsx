import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";
import { TOTAL_LEVELS } from "@/models/maze";

type ProgressContextValue = {
  highestUnlockedLevel: number;
  isLevelUnlocked: (level: number) => boolean;
  unlockNextLevel: (completedLevel: number) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);

  const unlockNextLevel = useCallback((completedLevel: number) => {
    const nextLevel = Math.min(completedLevel + 1, TOTAL_LEVELS);
    setHighestUnlockedLevel((current) => Math.max(current, nextLevel));
  }, []);

  const isLevelUnlocked = useCallback(
    (level: number) => level >= 1 && level <= highestUnlockedLevel,
    [highestUnlockedLevel],
  );

  return (
    <ProgressContext.Provider
      value={{ highestUnlockedLevel, isLevelUnlocked, unlockNextLevel }}
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
