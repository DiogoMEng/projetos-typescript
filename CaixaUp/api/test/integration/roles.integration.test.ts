import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../../src/app.js";
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

describe("Roles e permissões - integração", () => {
  it("I34 - registra role nova", async () => {
    const response = await request(app)
      .post("/roles/register")
      .send({ name: "NEW", description: "Nova" });
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("NEW");
  });

  it("I35 - rejeita role duplicada", async () => {
    const response = await request(app)
      .post("/roles/register")
      .send({ name: "OWNER", description: "Owner role" });
    expect(response.status).toBe(409);
  });

  it("I36 - cria associação válida pelo endpoint real", async () => {
    const owner = await createUser();
    const member = await createUser();
    const box = await createBox(owner.userId);
    const manager = await createRole("MANAGER");
    await assignRole(
      owner.userId,
      box.boxBottomId,
      (await createRole("OWNER"))!.roleId,
    );
    const response = await request(app)
      .post(`/role-user-box-bottoms/box-bottom/${box.boxBottomId}/register/`)
      .set(authHeader(tokenFor(owner)))
      .send({ userId: member.userId, roleId: manager!.roleId });
    expect(response.status).toBe(201);
  });

  it("I37 - rejeita associação com ID inexistente", async () => {
    const owner = await createUser();
    const box = await createBox(owner.userId);
    const role = await createRole("MANAGER");
    await assignRole(
      owner.userId,
      box.boxBottomId,
      (await createRole("OWNER"))!.roleId,
    );
    const response = await request(app)
      .post(`/role-user-box-bottoms/box-bottom/${box.boxBottomId}/register/`)
      .set(authHeader(tokenFor(owner)))
      .send({
        userId: "00000000-0000-0000-0000-000000000000",
        roleId: role!.roleId,
      });
    expect(response.status).toBe(404);
  });

  it("I38 - lista associações da caixinha", async () => {
    const owner = await createUser();
    const box = await createBox(owner.userId);
    await assignRole(
      owner.userId,
      box.boxBottomId,
      (await createRole("OWNER"))!.roleId,
    );
    const response = await request(app)
      .get(`/role-user-box-bottoms/box-bottom/${box.boxBottomId}`)
      .set(authHeader(tokenFor(owner)));
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].assignedRole.name).toBe("OWNER");
  });

  it("I39 - atualiza e remove associação pelos endpoints reais", async () => {
    const owner = await createUser();
    const member = await createUser();
    const box = await createBox(owner.userId);
    const viewer = await createRole("VIEWER");
    const manager = await createRole("MANAGER");
    await assignRole(
      owner.userId,
      box.boxBottomId,
      (await createRole("OWNER"))!.roleId,
    );
    const permission = await (
      await import("#models/index.js")
    ).DB.RoleUserBoxBottoms.create({
      userId: member.userId,
      boxBottomId: box.boxBottomId,
      roleId: viewer!.roleId,
    });
    const edit = await request(app)
      .put(
        `/role-user-box-bottoms/box-bottom/${member.userId}/${box.boxBottomId}`,
      )
      .set(authHeader(tokenFor(owner)))
      .send({ roleId: manager!.roleId });
    const deletion = await request(app)
      .delete(
        `/role-user-box-bottoms/${permission.roleUserBoxBottomId}/box-bottom/${box.boxBottomId}`,
      )
      .set(authHeader(tokenFor(owner)));
    expect(edit.status).toBe(200);
    expect(deletion.status).toBe(200);
  });
});
