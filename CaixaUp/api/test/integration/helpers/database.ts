import { DB } from "#models/index.js";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

export async function prepareDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Integração exige NODE_ENV=test");
  }
  execFileSync("npx", ["sequelize-cli", "db:migrate"], {
    cwd: resolve(process.cwd()),
    stdio: "inherit",
  });
  await DB.sequelize.authenticate();
  await DB.sequelize.query(
    "TRUNCATE TABLE role_user_box_bottoms, transactions, box_bottoms, categories, users, roles CASCADE",
  );
  await DB.Roles.bulkCreate([
    { name: "OWNER", description: "Owner role" },
    { name: "MANAGER", description: "Manager role" },
    { name: "EDITOR", description: "Editor role" },
    { name: "CONTRIBUTOR", description: "Contributor role" },
    { name: "ANALYST", description: "Analyst role" },
    { name: "VIEWER", description: "Viewer role" },
  ]);
}

export async function clearDatabase(): Promise<void> {
  await DB.sequelize.query(
    "TRUNCATE TABLE role_user_box_bottoms, transactions, box_bottoms, categories, users, roles CASCADE",
  );
  await DB.Roles.bulkCreate([
    { name: "OWNER", description: "Owner role" },
    { name: "MANAGER", description: "Manager role" },
    { name: "EDITOR", description: "Editor role" },
    { name: "CONTRIBUTOR", description: "Contributor role" },
    { name: "ANALYST", description: "Analyst role" },
    { name: "VIEWER", description: "Viewer role" },
  ]);
}

export async function closeDatabase(): Promise<void> {
  await DB.sequelize.close();
}
