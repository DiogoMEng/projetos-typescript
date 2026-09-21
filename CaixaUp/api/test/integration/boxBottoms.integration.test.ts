import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../../src/app.js";
import { DB } from "#models/index.js";
import {
  assignRole,
  authHeader,
  createBox,
  createRole,
  createUser,
  tokenFor,
} from "./helpers/factories.js";
import { useDatabaseHooks } from "./helpers/hooks.js";

useDatabaseHooks();

async function createBoxThroughApi(
  userId: string,
  token: string,
  name = "Minha Caixinha",
) {
  return request(app).post("/box-bottoms").set(authHeader(token)).send({
    name,
    description: "Reserva mensal",
    targetValue: 500,
  });
}

describe("BoxBottoms - integração", () => {
  it("I18 - cria caixinha com id e nome", async () => {
    const user = await createUser();
    const response = await createBoxThroughApi(user.userId, tokenFor(user));
    expect(response.status).toBe(201);
    expect(response.body.boxBottomId).toEqual(expect.any(String));
    expect(response.body.message).toContain("Minha Caixinha");
  });

  it("I19 - cria vínculo OWNER para o criador", async () => {
    const user = await createUser();
    const response = await createBoxThroughApi(user.userId, tokenFor(user));
    const permission = await DB.RoleUserBoxBottoms.findOne({
      where: { userId: user.userId, boxBottomId: response.body.boxBottomId },
      include: [{ model: DB.Roles, as: "assignedRole" }],
    });
    expect(permission?.assignedRole?.name).toBe("OWNER");
  });

  it("I20 - rejeita caixinha duplicada do mesmo usuário", async () => {
    const user = await createUser();
    const token = tokenFor(user);
    await createBoxThroughApi(user.userId, token, "Duplicada");
    const response = await createBoxThroughApi(user.userId, token, "Duplicada");
    expect(response.status).toBe(409);
    expect(await DB.BoxBottoms.count({ where: { userId: user.userId } })).toBe(
      1,
    );
  });

  it("I21 - revela caixa órfã quando OWNER não existe", async () => {
    await DB.Roles.destroy({ where: { name: "OWNER" } });
    const user = await createUser();
    const response = await createBoxThroughApi(user.userId, tokenFor(user));
    expect(response.status).toBe(404);
    expect(await DB.BoxBottoms.count({ where: { userId: user.userId } })).toBe(
      1,
    );
    expect(await DB.RoleUserBoxBottoms.count()).toBe(0);
  });

  it("I22 - lista caixinhas do dono ou de membro", async () => {
    const owner = await createUser();
    const member = await createUser();
    const ownerRole = await createRole("OWNER");
    const box = await createBox(owner.userId);
    await assignRole(owner.userId, box.boxBottomId, ownerRole!.roleId);
    const response = await request(app)
      .get("/box-bottoms")
      .set(authHeader(tokenFor(member)));
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    const memberRole = await createRole("VIEWER");
    await assignRole(member.userId, box.boxBottomId, memberRole!.roleId);
    const withMember = await request(app)
      .get("/box-bottoms")
      .set(authHeader(tokenFor(member)));
    expect(withMember.body.map((item: any) => item.boxBottomId)).toContain(
      box.boxBottomId,
    );
  });

  it("I23 - bloqueia acesso a caixinha sem vínculo", async () => {
    const owner = await createUser();
    const other = await createUser();
    const box = await createBox(owner.userId);
    const response = await request(app)
      .get(`/box-bottoms/${box.boxBottomId}`)
      .set(authHeader(tokenFor(other)));
    expect(response.status).toBe(403);
  });

  it("I24 - owner atualiza caixinha", async () => {
    const user = await createUser();
    const token = tokenFor(user);
    const created = await createBoxThroughApi(user.userId, token);
    await assignRole(
      user.userId,
      created.body.boxBottomId,
      (await createRole("OWNER"))!.roleId,
    );
    const response = await request(app)
      .put(`/box-bottoms/${created.body.boxBottomId}`)
      .set(authHeader(token))
      .send({ name: "Atualizada" });
    expect(response.status).toBe(200);
    expect((await DB.BoxBottoms.findByPk(created.body.boxBottomId))?.name).toBe(
      "Atualizada",
    );
  });

  it("I25 - delete remove caixinha e associação relacionada", async () => {
    const user = await createUser();
    const token = tokenFor(user);
    const created = await createBoxThroughApi(user.userId, token);
    await assignRole(
      user.userId,
      created.body.boxBottomId,
      (await createRole("OWNER"))!.roleId,
    );
    const response = await request(app)
      .delete(`/box-bottoms/${created.body.boxBottomId}`)
      .set(authHeader(token));
    expect(response.status).toBe(200);
    expect(await DB.BoxBottoms.findByPk(created.body.boxBottomId)).toBeNull();
    expect(
      await DB.RoleUserBoxBottoms.count({
        where: { boxBottomId: created.body.boxBottomId },
      }),
    ).toBe(0);
  });

  it("I26 - não-owner não pode editar nem remover caixinha", async () => {
    const owner = await createUser();
    const member = await createUser();
    const box = await createBox(owner.userId);
    await assignRole(
      member.userId,
      box.boxBottomId,
      (await createRole("VIEWER"))!.roleId,
    );
    const header = authHeader(tokenFor(member));
    expect(
      (
        await request(app)
          .put(`/box-bottoms/${box.boxBottomId}`)
          .set(header)
          .send({ name: "X" })
      ).status,
    ).toBe(403);
    expect(
      (await request(app).delete(`/box-bottoms/${box.boxBottomId}`).set(header))
        .status,
    ).toBe(403);
  });
});
