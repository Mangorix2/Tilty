import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

export type MazePosition = {
  x: number;
  y: number;
};

export type CollisionType = "hole" | "hazardWall";

const MAX_SPEED = 23;
const TILT_ACCELERATION = 18;
const FRICTION = 2.5;
const TILT_SMOOTHING = 0.28;
const BALL_RADIUS = 0.2;

export function useTiltMovement(
  maze: readonly string[],
  initialPosition: MazePosition,
  enabled = true,
  resetKey = 0,
) {
  const [position, setPosition] = useState(initialPosition);
  const [isDead, setIsDead] = useState(false);
  const [collisionType, setCollisionType] = useState<CollisionType | null>(null);
  const isDeadRef = useRef(false);
  const velocity = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  const lastUpdateAt = useRef<number | null>(null);

  useEffect(() => {
    setPosition(initialPosition);
    setIsDead(false);
    setCollisionType(null);
    isDeadRef.current = false;

    if (!enabled) {
      velocity.current = { x: 0, y: 0 };
      tilt.current = { x: 0, y: 0 };
      lastUpdateAt.current = null;
      return;
    }

    let subscription: ReturnType<typeof Accelerometer.addListener> | undefined;
    let active = true;

    const startSensor = async () => {
      const available = await Accelerometer.isAvailableAsync();
      if (!active || !available) return;

      Accelerometer.setUpdateInterval(50);
      subscription = Accelerometer.addListener((measurement) => {
        if (isDeadRef.current) return;

        const now = Date.now();
        const previousUpdateAt = lastUpdateAt.current ?? now;
        const deltaSeconds = Math.min((now - previousUpdateAt) / 1000, 0.08);
        lastUpdateAt.current = now;

        tilt.current.x += (measurement.x - tilt.current.x) * TILT_SMOOTHING;
        tilt.current.y += (measurement.y - tilt.current.y) * TILT_SMOOTHING;
        velocity.current.x = clamp(
          (velocity.current.x + tilt.current.x * TILT_ACCELERATION * deltaSeconds) *
            Math.exp(-FRICTION * deltaSeconds),
          -MAX_SPEED,
          MAX_SPEED,
        );
        velocity.current.y = clamp(
          (velocity.current.y - tilt.current.y * TILT_ACCELERATION * deltaSeconds) *
            Math.exp(-FRICTION * deltaSeconds),
          -MAX_SPEED,
          MAX_SPEED,
        );

        setPosition((current) => {
          const result = moveWithCollision(current, velocity.current, deltaSeconds, maze);
          if (result.collisionType) {
            isDeadRef.current = true;
            velocity.current = { x: 0, y: 0 };
            setIsDead(true);
            setCollisionType(result.collisionType);
          }
          return result.position;
        });
      });
    };

    void startSensor();
    return () => {
      active = false;
      subscription?.remove();
    };
  }, [enabled, initialPosition, maze, resetKey]);

  return { position, isDead, collisionType };
}

function moveWithCollision(
  current: MazePosition,
  currentVelocity: MazePosition,
  deltaSeconds: number,
  maze: readonly string[],
): { position: MazePosition; collisionType: CollisionType | null } {
  const nextX = current.x + currentVelocity.x * deltaSeconds;
  const nextY = current.y + currentVelocity.y * deltaSeconds;
  const collisionType =
    getCollisionType({ x: nextX, y: current.y }, maze) ??
    getCollisionType({ x: current.x, y: nextY }, maze) ??
    getCollisionType({ x: nextX, y: nextY }, maze);
  const canMoveX = !collidesWithWall({ x: nextX, y: current.y }, maze);
  const canMoveY = !collidesWithWall({ x: canMoveX ? nextX : current.x, y: nextY }, maze);

  if (!canMoveX) currentVelocity.x = 0;
  if (!canMoveY) currentVelocity.y = 0;

  return {
    position: {
      x: canMoveX ? nextX : current.x,
      y: canMoveY ? nextY : current.y,
    },
    collisionType,
  };
}

function getCollisionType(position: MazePosition, maze: readonly string[]): CollisionType | null {
  const minColumn = Math.floor(position.x - BALL_RADIUS);
  const maxColumn = Math.floor(position.x + BALL_RADIUS);
  const minRow = Math.floor(position.y - BALL_RADIUS);
  const maxRow = Math.floor(position.y + BALL_RADIUS);

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let column = minColumn; column <= maxColumn; column += 1) {
      const cell = maze[row]?.[column];
      if (cell === "2") return "hole";
      if (cell === "3") return "hazardWall";
    }
  }

  return null;
}

function collidesWithWall(position: MazePosition, maze: readonly string[]) {
  const minColumn = Math.floor(position.x - BALL_RADIUS);
  const maxColumn = Math.floor(position.x + BALL_RADIUS);
  const minRow = Math.floor(position.y - BALL_RADIUS);
  const maxRow = Math.floor(position.y + BALL_RADIUS);

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let column = minColumn; column <= maxColumn; column += 1) {
      const cell = maze[row]?.[column];
      if (cell !== "0") return true;
    }
  }

  return false;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}
