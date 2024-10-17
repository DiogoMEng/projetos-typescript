<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  import { animateWalls } from "../animations/grid";
  import { defaults } from "../lib/utils";
  import { grid, state } from "../stores";
  import { State } from "../types";
  import Node from "./Node.svelte";

  async function handleResetGrid() {
    const currentState = get(state);

    if (currentState !== State.Idle) {
      throw new Error("Cannot reset grid while not idle");
    }

    grid.update((value) => {
      value.setStart(defaults.start.toString());
      value.setGoal(defaults.goal.toString());

      return value;
    });

    await animateWalls(defaults.walls);

    state.set(State.Idle);
  }

  onMount(() => {
    handleResetGrid();
  });
</script>

<div
  class="table border-[2px] border-solid border-black border-spacing-0 border-collapse"
>
  {#each $grid.matrix as row}
    <div class="table-row">
      {#each row as node}
        <Node
          bind:node
          start={$grid.start !== null ? node.samePosition($grid.start) : false}
          goal={$grid.goal !== null ? node.samePosition($grid.goal) : false}
          path={$grid.path.some((n) => node.samePosition(n))}
        />
      {/each}
    </div>
  {/each}
</div>
