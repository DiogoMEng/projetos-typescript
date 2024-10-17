import { writable } from "svelte/store";

import { Grid } from "./lib/grid";
import { defaults } from "./lib/utils";
import { State } from "./types";

function createGridStore() {
  const { subscribe, set, update } = writable(new Grid());

  return {
    subscribe,
    set,
    update,
    reset: () => set(new Grid()),
    forceUpdate: () => update((grid) => grid),
  };
}

export const state = writable(State.Idle);
export const size = writable(defaults.size);
export const speed = writable(defaults.speed);
export const grid = createGridStore();
