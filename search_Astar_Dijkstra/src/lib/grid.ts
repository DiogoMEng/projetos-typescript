import { get } from "svelte/store";

import { size } from "../stores";
import { Node } from "./node";

export class Grid {
  private _nodes: Map<string, Node>;
  private _size: [number, number];

  start: Node | null;
  goal: Node | null;
  path: Node[];

  constructor(nodes?: Map<string, Node>) {
    this._size = get(size);
    this.start = null;
    this.goal = null;
    this.path = [];

    if (nodes) {
      this._nodes = nodes;
    } else {
      this._nodes = this.create();
    }
  }

  protected create() {
    const nodes: Map<string, Node> = new Map();
    const [width, height] = get(size);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const node = new Node([x, y]);
        nodes.set(node.key, node);
      }
    }

    return nodes;
  }

  getNode(key: string) {
    return this._nodes.get(key);
  }

  setNode(key: string, node: Node) {
    this._nodes.set(key, node);
  }

  setStart(key: string) {
    const node = this.getNode(key)!;

    if (this.goal && node.samePosition(this.goal)) {
      this.goal = null;
    }

    this.start = node;
    this.setNode(key, node);
  }

  setGoal(key: string) {
    const node = this.getNode(key)!;

    if (this.start && node.samePosition(this.start)) {
      this.start = null;
    }

    this.goal = node;
    this.setNode(key, node);
  }

  neighbors(key: string, diagonal: boolean) {
    const node = this.getNode(key)!;
    const [x, y] = node.position;
    const neighbors: Node[] = [];

    if (y > 0) {
      const neighbor = this.getNode([x, y - 1].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (y > 0 && x < this._size[0] - 1 && diagonal) {
      const neighbor = this.getNode([x + 1, y - 1].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (x < this._size[0] - 1) {
      const neighbor = this.getNode([x + 1, y].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (y < this._size[1] - 1 && x < this._size[0] - 1 && diagonal) {
      const neighbor = this.getNode([x + 1, y + 1].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (y < this._size[1] - 1) {
      const neighbor = this.getNode([x, y + 1].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (y < this._size[1] - 1 && x > 0 && diagonal) {
      const neighbor = this.getNode([x - 1, y + 1].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (x > 0) {
      const neighbor = this.getNode([x - 1, y].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    if (y > 0 && x > 0 && diagonal) {
      const neighbor = this.getNode([x - 1, y - 1].toString());

      if (neighbor && neighbor.walkable) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  toggleWall(key: string) {
    const node = this.getNode(key)!;

    if (
      (this.start && node.samePosition(this.start)) ||
      (this.goal && node.samePosition(this.goal))
    ) {
      return;
    }

    node.walkable = !node.walkable;
    this.setNode(key, node);
  }

  resetPathOpenedClosed() {
    this.path = [];
    this._nodes.forEach((node) => {
      node.g = 0;
      node.h = 0;
      node.parent = null;
      node.opened = false;
      node.closed = false;
    });
  }

  resetWalls() {
    this._nodes.forEach((node) => {
      node.walkable = true;
    });
  }

  get matrix() {
    const matrix: Node[][] = [];

    for (let y = 0; y < this._size[1]; y++) {
      matrix[y] = [];
      for (let x = 0; x < this._size[0]; x++) {
        matrix[y][x] = this.getNode([x, y].toString())!;
      }
    }

    return matrix;
  }
}
