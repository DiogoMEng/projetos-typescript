import { Heuristic } from "../types";
import { backtrace } from "./backtrace";
import { calculateCost } from "./cost";
import type { Grid } from "./grid";
import { calculateHeuristic } from "./heuristic";
import type { Node } from "./node";

export type Result = {
  opened: Node[][];
  closed: Node[][];
  path: Node[];
};

export function aStar(grid: Grid, heuristic: Heuristic): Result {
  if (!grid.start || !grid.goal) {
    throw new Error("Cannot run without a start and goal node");
  }

  const opened: Node[][] = [];
  const closed: Node[][] = [];

  grid.start.g = 0;
  grid.start.h = calculateHeuristic(grid.start, grid.goal, heuristic);

  const openSet: Node[] = [grid.start];
  const closedSet: Node[] = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => {
      if (a.f === b.f) {
        return a.h - b.h;
      }

      return a.f - b.f;
    });

    const current = openSet.shift()!;
    closedSet.push(current);

    if (current === grid.goal) {
      return {
        opened,
        closed,
        path: backtrace(current),
      };
    }

    const neighbors = grid.neighbors(
      current.key,
      heuristic !== Heuristic.Manhattan
    );

    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor)) continue;

      const g = current.g + calculateCost(current, neighbor);

      if (g < neighbor.g || !openSet.includes(neighbor)) {
        neighbor.g = g;
        neighbor.h = calculateHeuristic(neighbor, grid.goal, heuristic);
        neighbor.parent = current;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }

    opened.push(openSet.slice());
    closed.push(closedSet.slice());
  }

  return {
    opened,
    closed,
    path: [],
  };
}

export function dijkstra(grid: Grid): Result {
  if (!grid.start || !grid.goal) {
    throw new Error("Cannot run without a start and goal node");
  }

  const opened: Node[][] = [];
  const closed: Node[][] = [];

  grid.start.g = 0;

  const openSet: Node[] = [grid.start];
  const closedSet: Node[] = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.g - b.g);

    const current = openSet.shift()!;
    closedSet.push(current);

    if (current === grid.goal) {
      return {
        opened,
        closed,
        path: backtrace(current),
      };
    }

    const neighbors = grid.neighbors(current.key, true);

    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor)) continue;

      const g = current.g + calculateCost(current, neighbor);

      if (g < neighbor.g || !openSet.includes(neighbor)) {
        neighbor.g = g;
        neighbor.parent = current;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }

    opened.push(openSet.slice());
    closed.push(closedSet.slice());
  }

  return {
    opened,
    closed,
    path: [],
  };
}
