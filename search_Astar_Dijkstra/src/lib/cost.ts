import type { Node } from "./node";

export function calculateCost(start: Node, goal: Node) {
  if (
    start.position[0] === goal.position[0] ||
    start.position[1] === goal.position[1]
  ) {
    return 10;
  }

  return 14;
}
