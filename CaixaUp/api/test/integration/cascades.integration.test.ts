import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../../src/app.js";
import { DB } from "#models/index.js";
import {
  authHeader,
  createBox,
  createCategory,
  createRole,
  createTransaction,
  createUser,
  tokenFor,
} from "./helpers/factories.js";
import { useDatabaseHooks } from "./helpers/hooks.js";

useDatabaseHooks();

describe("Integridade referencial - integração", () => {
  it("I40 - demonstra a validação quebrada da remoção de User e valida cascata no model", async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    await createCategory(user.userId);
    const response = await request(app)
      .delete(`/users/${user.userId}`)
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(422);
    await DB.Users.destroy({ where: { userId: user.userId } });
    expect(await DB.BoxBottoms.findByPk(box.boxBottomId)).toBeNull();
    expect(
      await DB.RoleUserBoxBottoms.count({ where: { userId: user.userId } }),
    ).toBe(0);
  });

  it("I41 - remover category remove transações relacionadas por cascade", async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const category = await createCategory(user.userId);
    const transaction = await createTransaction(
      box.boxBottomId,
      category.categoryId,
    );
    await DB.Categories.destroy({ where: { categoryId: category.categoryId } });
    expect(
      await DB.Transactions.findByPk(transaction.transactionId),
    ).toBeNull();
  });

  it("I42 - remover box remove transações e permissões relacionadas por cascade", async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const category = await createCategory(user.userId);
    const transaction = await createTransaction(
      box.boxBottomId,
      category.categoryId,
    );
    const role = await createRole("OWNER");
    await DB.RoleUserBoxBottoms.create({
      userId: user.userId,
      boxBottomId: box.boxBottomId,
      roleId: role!.roleId,
    });
    await DB.BoxBottoms.destroy({ where: { boxBottomId: box.boxBottomId } });
    expect(
      await DB.Transactions.findByPk(transaction.transactionId),
    ).toBeNull();
    expect(
      await DB.RoleUserBoxBottoms.count({
        where: { boxBottomId: box.boxBottomId },
      }),
    ).toBe(0);
  });
});
