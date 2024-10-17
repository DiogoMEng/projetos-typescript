export enum State {
  Idle,
  Animating,
  Searching,
  Finished,
}

export type Position = [number, number];

export enum Algorithm {
  AStar,
  Dijkstra,
}

export enum Heuristic {
  Manhattan,
  Euclidean,
  Diagonal,
}
