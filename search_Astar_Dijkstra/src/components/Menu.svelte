<script lang="ts">
  import { get } from "svelte/store";
  import {
    animateOpenedAndClosed,
    animatePath,
    animateWalls,
  } from "../animations/grid";
  import { aStar, dijkstra } from "../lib/path";
  import { defaults } from "../lib/utils";
  import { grid, state } from "../stores";
  import { Algorithm, Heuristic, State } from "../types";
  import "./menu.css"

  let algorithm: Algorithm = Algorithm.AStar;
  let heuristic: Heuristic = Heuristic.Euclidean;

  async function handleStart() {
    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot start while not idle");
    }

    grid.update((value) => {
      value.resetPathOpenedClosed();
      return value;
    });

    const currentGrid = get(grid);

    if (algorithm === Algorithm.AStar) {
      const { opened, closed, path } = aStar(currentGrid, heuristic);

      await animateOpenedAndClosed(opened, closed);
      await animatePath(path);
    } else if (algorithm === Algorithm.Dijkstra) {
      const { opened, closed, path } = dijkstra(currentGrid);

      await animateOpenedAndClosed(opened, closed);
      await animatePath(path);
    }
  }

  async function handleResetPath() {
    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot reset path while not idle");
    }

    grid.update((value) => {
      value.resetPathOpenedClosed();
      return value;
    });
  }

  async function handleResetWalls() {
    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot reset walls while not idle");
    }

    grid.update((value) => {
      value.resetPathOpenedClosed();
      return value;
    });

    grid.update((value) => {
      value.resetWalls();
      return value;
    });

    await animateWalls(defaults.walls);
  }

  async function handleResetStartAndGoal() {
    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot reset walls while not idle");
    }

    grid.update((value) => {
      value.resetPathOpenedClosed();
      value.setStart(defaults.start.toString());
      value.setGoal(defaults.goal.toString());
      return value;
    });
  }
</script>

<nav class="flex flex-col items-center gap-4 mt-[10px] rounded-md p-2">
  <div class="flex flex-row gap-2">
    <button
      class="glow-on-hover w-[180px] rounded-md px-3 py-2 bg-[#36B336] text-white font-medium border border-[#6b7280]"
      on:click={handleStart}>Start</button
    >
    <select class="w-[180px] rounded-md text-gray-900" bind:value={algorithm}>
      <option value={Algorithm.AStar}>A*</option>
      <option value={Algorithm.Dijkstra}>Dijkstra</option>
    </select>
    <select
      class="w-[180px] rounded-md text-gray-900"
      disabled={algorithm === Algorithm.Dijkstra}
      bind:value={heuristic}
    >
      <option value={Heuristic.Euclidean}>Euclidean</option>
      <option value={Heuristic.Manhattan}>Manhattan</option>
      <option value={Heuristic.Diagonal}>Diagonal</option>
    </select>
  </div>
  <div class="flex flex-row gap-2 text-[#fdfdfd]">
    <button
      class="w-[180px] rounded-md px-3 py-2 bg-white text-gray-900 border border-[#6b7280] disabled:opacity-70"
      disabled={$state !== State.Idle}
      on:click={handleResetPath}>Reset Path</button
    >
    <button
      class="w-[180px] rounded-md px-3 py-2 bg-white text-gray-900 border border-[#6b7280] disabled:opacity-70"
      disabled={$state !== State.Idle}
      on:click={handleResetWalls}>Reset Walls</button
    >
    <button
      class="w-[180px] rounded-md px-3 py-2 bg-white text-gray-900 border border-[#6b7280] disabled:opacity-70"
      disabled={$state !== State.Idle}
      on:click={handleResetStartAndGoal}>Reset Start and Goal</button
    >
  </div>
</nav>
