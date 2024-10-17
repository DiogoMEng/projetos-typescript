import type { Node } from "./node";

export function backtrace(node: Node) {
  const path: Node[] = [];
  let current = node;

  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
}
