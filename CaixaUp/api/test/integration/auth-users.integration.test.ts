import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, expect, it } from "@jest/globals";
import app from "../../src/app.js";
import { DB } from "#models/index.js";
import { JWT_SECRET } from "#config/index.js";
import { authHeader, createUser, tokenFor } from "./helpers/factories.js";
import { useDatabaseHooks } from "./helpers/hooks.js";

useDatabaseHooks();

describe("Auth - integração", () => {
  it("I1 - faz login válido e retorna JWT decodificável", async () => {
    const user = await createUser({ email: "login@example.com" });
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: "SenhaSegura123",
    });
    expect(response.status).toBe(200);
    expect(
      jwt.verify(response.body.accessToken, JWT_SECRET as string),
    ).toMatchObject({
      userId: user.userId,
      email: user.email,
    });
  });

  it("I2 - rejeita email inexistente sem token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "missing@example.com",
      password: "SenhaSegura123",
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado");
  });

  it("I3 - rejeita senha incorreta", async () => {
    const user = await createUser();
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: "SenhaErrada123",
    });
    expect(response.status).toBe(401);
  });

  it("I4 - valida body de login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "invalido" });
    expect(response.status).toBe(422);
  });
});

describe("Users - integração", () => {
  it("I5 - cria usuário com hash persistido", async () => {
    const response = await request(app).post("/users").send({
      name: "Novo Usuário",
      email: "novo@example.com",
      password: "SenhaSegura123",
    });
    expect(response.status).toBe(201);
    const saved = await DB.Users.findOne({
      where: { email: "novo@example.com" },
    });
    expect(saved?.password).not.toBe("SenhaSegura123");
    expect(response.body.data.userId).toBe(saved?.userId);
  });

  it("I6 - rejeita email duplicado", async () => {
    await createUser({ email: "duplicate@example.com" });
    const response = await request(app).post("/users").send({
      name: "Outro Usuário",
      email: "duplicate@example.com",
      password: "SenhaSegura123",
    });
    expect(response.status).toBe(409);
    expect(
      await DB.Users.count({ where: { email: "duplicate@example.com" } }),
    ).toBe(1);
  });

  it("I7 - rejeita campos obrigatórios ausentes", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Incompleto" });
    expect(response.status).toBe(422);
  });

  it("I8 - GET users não expõe password", async () => {
    const user = await createUser();
    const response = await request(app)
      .get("/users")
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(200);
    expect(response.body[0]).not.toHaveProperty("password");
  });

  it("I9 - busca usuário por UUID", async () => {
    const user = await createUser();
    const response = await request(app)
      .get(`/users/${user.userId}`)
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.userId);
    expect(response.body).not.toHaveProperty("password");
  });

  it("I10 - PUT de usuário atualiza os dados", async () => {
    const user = await createUser();
    const response = await request(app)
      .put(`/users/${user.userId}`)
      .set(authHeader(tokenFor(user)))
      .send({ name: "Nome Atualizado" });
    expect(response.status).toBe(200);
    expect((await DB.Users.findByPk(user.userId))?.name).toBe(
      "Nome Atualizado",
    );
  });

  it("I11 - DELETE remove o usuário", async () => {
    const user = await createUser();
    const response = await request(app)
      .delete(`/users/${user.userId}`)
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(200);
    expect(await DB.Users.findByPk(user.userId)).toBeNull();
  });
});
