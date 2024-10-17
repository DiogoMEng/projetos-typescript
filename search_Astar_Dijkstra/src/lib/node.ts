import type { Position } from "../types";

export class Node {
  readonly position: Position;

  private _f: number;
  private _g: number;
  private _h: number;
  private _parent: Node | null;
  private _opened: boolean;
  private _closed: boolean;
  private _walkable: boolean;

  constructor(position: Position) {
    this.position = position;
    this._f = 0;
    this._g = 0;
    this._h = 0;
    this._parent = null;
    this._opened = false;
    this._closed = false;
    this._walkable = true;
  }

  reset() {
    this._f = 0;
    this._g = 0;
    this._h = 0;
    this._parent = null;
    this._opened = false;
    this._closed = false;
    this._walkable = true;
  }

  calculateF() {
    this._f = this._g + this._h;
  }

  clearFGH() {
    this._f = 0;
    this._g = 0;
    this._h = 0;
  }

  samePosition(other: Node) {
    return (
      this.position[0] === other.position[0] &&
      this.position[1] === other.position[1]
    );
  }

  get key() {
    return this.position.toString();
  }

  get f() {
    return this._f;
  }

  get g() {
    return this._g;
  }

  get h() {
    return this._h;
  }

  get parent() {
    return this._parent;
  }

  get opened() {
    return this._opened;
  }

  get closed() {
    return this._closed;
  }

  get walkable() {
    return this._walkable;
  }

  set g(value: number) {
    this._g = value;
    this.calculateF();
  }

  set h(value: number) {
    this._h = value;
    this.calculateF();
  }

  set parent(value: Node | null) {
    this._parent = value;
  }

  set opened(value: boolean) {
    this._opened = value;
  }

  set closed(value: boolean) {
    this._closed = value;
  }

  set walkable(value: boolean) {
    this._walkable = value;
  }
}
