import { get } from "svelte/store";

import type { Node } from "../lib/node";
import { grid, state } from "../stores";
import { State, type Position } from "../types";
import { wait } from "./utils";

export async function animateWalls(walls: Position[]) {
  if (walls.length === 0) return;

  const currentState = get(state);

  if (currentState !== State.Idle) {
    throw new Error("Cannot animate walls while not idle");
  }

  state.set(State.Animating);

  const currentGrid = get(grid);

  for (const wall of walls) {
    await wait();

    currentGrid.toggleWall(wall.toString());
    grid.forceUpdate();
  }

  state.set(State.Idle);
}

export async function animatePath(path: Node[]) {
  if (path.length === 0) return;

  const currentState = get(state);

  if (currentState !== State.Idle) {
    throw new Error("Cannot animate path while not idle");
  }

  state.set(State.Animating);

  const currentGrid = get(grid);

  for (const node of path) {
    await wait();

    currentGrid.path.push(node);
    grid.forceUpdate();
  }

  state.set(State.Idle);
}

export async function animateOpenedAndClosed(
  opened: Node[][],
  closed: Node[][]
) {
  if (opened.length === 0 && closed.length === 0) return;

  const currentState = get(state);

  if (currentState !== State.Idle) {
    throw new Error("Cannot animate opened and closed while not idle");
  }

  state.set(State.Animating);

  const currentGrid = get(grid);

  for (let i = 0; i < opened.length; i++) {
    await wait(5);

    for (const node of opened[i]) {
      node.opened = true;
      currentGrid.setNode(node.key, node);
    }

    for (const node of closed[i]) {
      node.closed = true;
      currentGrid.setNode(node.key, node);
    }

    grid.forceUpdate();
  }

  state.set(State.Idle);
}
