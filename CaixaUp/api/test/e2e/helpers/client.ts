import request from 'supertest';
import type { Server } from 'node:http';
import { DB } from '#models/index.js';

const DEFAULT_PASSWORD = 'SenhaSegura123';

interface RegisteredUser {
  userId: string;
  email: string;
}

export interface E2eAccount {
  userId: string;
  email: string;
  password: string;
  token: string;
}

export function authorization(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

export async function registerAndLogin(
  server: Server,
  email: string,
  name: string,
): Promise<E2eAccount> {
  const password = DEFAULT_PASSWORD;
  const user = await registerUser(server, name, email, password);
  const token = await loginUser(server, email, password);
  return { ...user, password, token };
}

async function registerUser(
  server: Server,
  name: string,
  email: string,
  password: string,
): Promise<RegisteredUser> {
  const registration = await request(server).post('/users').send({
    name,
    email,
    password,
  });
  if (registration.status !== 201) {
    throw new Error(`Registro E2E falhou: ${registration.status}`);
  }
  return { userId: registration.body.data.userId as string, email };
}

async function loginUser(
  server: Server,
  email: string,
  password: string,
): Promise<string> {
  const login = await request(server).post('/auth/login').send({
    email,
    password,
  });
  if (login.status !== 200) {
    throw new Error(`Login E2E falhou: ${login.status}`);
  }
  return login.body.accessToken as string;
}

export async function getRoleId(
  server: Server,
  roleName: string,
): Promise<string> {
  const response = await request(server).get('/roles');
  const role = response.body.find(
    (item: { name: string; roleId: string }) => item.name === roleName,
  );
  if (response.status !== 200 || !role) {
    throw new Error(`Role ${roleName} não encontrada via API`);
  }
  return role.roleId;
}

export async function createCategory(
  server: Server,
  token: string,
  name: string,
  type: 'receita' | 'despesa',
): Promise<string> {
  const response = await request(server)
    .post('/categories')
    .set(authorization(token))
    .send({ name, type });
  if (response.status !== 201) {
    throw new Error(`Criação de categoria E2E falhou: ${response.status}`);
  }
  return response.body.data.categoryId;
}

export async function createBox(
  server: Server,
  token: string,
  name: string,
): Promise<string> {
  const response = await request(server)
    .post('/box-bottoms')
    .set(authorization(token))
    .send({ name, description: 'Criada pelo fluxo E2E', targetValue: 1000 });
  if (response.status !== 201) {
    throw new Error(`Criação de caixinha E2E falhou: ${response.status}`);
  }
  return response.body.boxBottomId;
}

export async function createTransaction(
  server: Server,
  token: string,
  boxBottomId: string,
  categoryId: string,
  movementType: 'inflow' | 'outflow',
  value: number,
  description: string,
) {
  return request(server)
    .post(`/transactions/box-bottom/${boxBottomId}/category/${categoryId}`)
    .set(authorization(token))
    .send({
      movementType,
      value,
      transactionDate: '2026-10-01T12:00:00.000Z',
      description,
    });
}

export async function countTransactions(): Promise<number> {
  return DB.Transactions.count();
}
