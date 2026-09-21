import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../../src/app.js";
import { DB } from "#models/index.js";
import {
  authHeader,
  createCategory,
  createUser,
  tokenFor,
} from "./helpers/factories.js";
import { useDatabaseHooks } from "./helpers/hooks.js";

useDatabaseHooks();

describe("Categories - integração", () => {
  it("I12 - exige token", async () => {
    expect((await request(app).get("/categories")).status).toBe(401);
  });

  it("I13 - cria categoria vinculada ao usuário do token", async () => {
    const user = await createUser();
    const response = await request(app)
      .post("/categories")
      .set(authHeader(tokenFor(user)))
      .send({ name: "Receitas", type: "receita" });
    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBe(user.userId);
  });

  it("I14 - rejeita type inválido", async () => {
    const user = await createUser();
    const response = await request(app)
      .post("/categories")
      .set(authHeader(tokenFor(user)))
      .send({ name: "Inválida", type: "outro" });
    expect(response.status).toBe(422);
  });

  it("I15 - lista somente categorias do usuário autenticado", async () => {
    const first = await createUser();
    const second = await createUser();
    await createCategory(first.userId);
    await createCategory(second.userId);
    const response = await request(app)
      .get("/categories")
      .set(authHeader(tokenFor(first)));
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].userId).toBe(first.userId);
  });

  it("I16 - demonstra que GET individual de categoria de outro usuário não é bloqueado", async () => {
    const owner = await createUser();
    const other = await createUser();
    const category = await createCategory(owner.userId);
    const response = await request(app)
      .get(`/categories/${category.categoryId}`)
      .set(authHeader(tokenFor(other)));
    expect(response.status).toBe(200);
  });

  it("I17 - demonstra que PUT/DELETE de categoria de outro usuário não são bloqueados", async () => {
    const owner = await createUser();
    const other = await createUser();
    const category = await createCategory(owner.userId);
    const update = await request(app)
      .put(`/categories/${category.categoryId}`)
      .set(authHeader(tokenFor(other)))
      .send({ name: "Alterada" });
    const deletion = await request(app)
      .delete(`/categories/${category.categoryId}`)
      .set(authHeader(tokenFor(other)));
    expect(update.status).toBe(200);
    expect(deletion.status).toBe(200);
    expect(await DB.Categories.findByPk(category.categoryId)).toBeNull();
  });
});
