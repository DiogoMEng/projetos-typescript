import { Heuristic } from "../types";
import type { Node } from "./node";

export function euclidean(start: Node, goal: Node) {
  const dx = Math.abs(start.position[0] - goal.position[0]);
  const dy = Math.abs(start.position[1] - goal.position[1]);

  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10);
}

export function manhattan(start: Node, goal: Node) {
  const dx = Math.abs(start.position[0] - goal.position[0]);
  const dy = Math.abs(start.position[1] - goal.position[1]);

  return (dx + dy) * 10;
}

export function diagonal(start: Node, goal: Node) {
  const dx = Math.abs(start.position[0] - goal.position[0]);
  const dy = Math.abs(start.position[1] - goal.position[1]);

  return 10 * (dx + dy) + (14 - 2 * 10) * Math.min(dx, dy);
}

const heuristics: Record<Heuristic, (start: Node, goal: Node) => number> = {
  [Heuristic.Euclidean]: euclidean,
  [Heuristic.Manhattan]: manhattan,
  [Heuristic.Diagonal]: diagonal,
};

export function calculateHeuristic(
  start: Node,
  goal: Node,
  heuristic: Heuristic
) {
  return heuristics[heuristic](start, goal);
}
