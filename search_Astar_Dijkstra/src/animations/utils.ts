import { get } from "svelte/store";
import { speed } from "../stores";

export async function wait(multiplier: number = 1) {
  const ms = get(speed) * multiplier;
  await new Promise((resolve) => setTimeout(resolve, ms));
}
