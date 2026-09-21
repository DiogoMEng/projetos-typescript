import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import { clearDatabase, closeDatabase, prepareDatabase } from "./database.js";

export function useDatabaseHooks(): void {
  beforeAll(prepareDatabase);
  beforeEach(clearDatabase);
  afterAll(closeDatabase);
}
