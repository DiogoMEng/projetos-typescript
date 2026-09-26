import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DB } from '#models/index.js';
import { JWT_SECRET } from '#config/index.js';

let sequence = 0;

export async function createUser(overrides: Record<string, string> = {}) {
  sequence += 1;
  return DB.Users.create({
    name: overrides.name || `Usuário ${sequence}`,
    email: overrides.email || `user${sequence}@example.com`,
    password: await hash(overrides.password || 'SenhaSegura123', 8),
  });
}

export async function createRole(name: string) {
  return DB.Roles.findOne({ where: { name } });
}

export async function createCategory(userId: string, type = 'receita') {
  sequence += 1;
  return DB.Categories.create({
    name: `Categoria ${sequence}`,
    type,
    userId,
  });
}

export async function createBox(
  userId: string,
  name = `Caixinha ${++sequence}`,
) {
  return DB.BoxBottoms.create({
    name,
    description: 'Caixinha de teste',
    targetValue: 100,
    userId,
  });
}

export async function assignRole(
  userId: string,
  boxBottomId: string,
  roleId: string,
) {
  return DB.RoleUserBoxBottoms.create({ userId, boxBottomId, roleId });
}

export async function createTransaction(
  boxBottomId: string,
  categoryId: string,
) {
  return DB.Transactions.create({
    boxBottomId,
    categoryId,
    movementType: 'inflow',
    value: 10,
    transactionDate: new Date(),
    description: 'Transação de teste',
  });
}

export function tokenFor(user: { userId: string; email: string }): string {
  return jwt.sign(
    { userId: user.userId, email: user.email },
    JWT_SECRET as string,
  );
}

export function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
