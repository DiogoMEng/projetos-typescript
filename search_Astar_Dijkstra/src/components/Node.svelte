<script lang="ts">
  import { get } from "svelte/store";

  import type { Node } from "../lib/node";
  import { calculateColor } from "../lib/utils";
  import { grid, state } from "../stores";
  import { State } from "../types";

  export let node: Node;
  export let start: boolean = false;
  export let goal: boolean = false;
  export let path: boolean = false;

  $: color = calculateColor(node, start, goal, path);

  function handleMouseDown() {
    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot toggle walls while not idle");
    }

    grid.update((value) => {
      value.resetPathOpenedClosed();
      value.toggleWall(node.key);
      return value;
    });
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDragStart(
    event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }
  ) {
    const data = {
      start,
      goal,
    };

    event.dataTransfer!.dropEffect = "copy";
    event.dataTransfer!.setData("text", JSON.stringify(data));
  }

  function handleDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }
  ) {
    event.preventDefault();

    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot move start/goal while not idle");
    }

    const rawData = event.dataTransfer?.getData("text");

    if (!rawData) {
      return;
    }

    const data: {
      start: boolean;
      goal: boolean;
    } = JSON.parse(rawData);

    grid.update((value) => {
      if (start || goal) {
        return value;
      }

      if ((data.start || data.goal) && !node.walkable) {
        value.resetPathOpenedClosed();
        value.toggleWall(node.key);
      }

      if (data.start) {
        value.resetPathOpenedClosed();
        value.setStart(node.key);
      } else if (data.goal) {
        value.resetPathOpenedClosed();
        value.setGoal(node.key);
      }

      return value;
    });
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="
    table-cell border border-solid border-black w-[60px] h-[60px] text-center align-middle text-white transition-colors duration-500
    {(start || goal) && 'font-bold select-none cursor-grab'}
  "
  style="background-color: {color};"
  draggable={start || goal}
  on:mousedown={handleMouseDown}
  on:dragover={handleDragOver}
  on:dragstart={handleDragStart}
  on:drop={handleDrop}
>
  {#if start}
    S
  {:else if goal}
    <div class="flex flex-col">
      G
      {#if node.g}
        <span class="text-[16px] font-medium">{node.g}</span>
      {/if}
    </div>
  {:else if node.f || node.g || node.h}
    <div class="flex flex-col p-2">
      <div class="flex flex-row justify-between text-[12px] font-medium">
        <span>{node.g}</span>
        <span>{node.h}</span>
      </div>
      <span class="text-[16px] font-medium">{node.f}</span>
    </div>
  {/if}
</div>
