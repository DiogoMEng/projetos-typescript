import request from 'supertest';
import { describe, expect, it } from '@jest/globals';
import app from '../../src/app.js';
import { DB } from '#models/index.js';
import {
  assignRole,
  authHeader,
  createBox,
  createCategory,
  createRole,
  createTransaction,
  createUser,
  tokenFor,
} from './helpers/factories.js';
import { useDatabaseHooks } from './helpers/hooks.js';

useDatabaseHooks();

describe('Integridade referencial - integração', () => {
  it('I40 - remove User e recursos relacionados em cascata', async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const category = await createCategory(user.userId);
    const transaction = await createTransaction(
      box.boxBottomId,
      category.categoryId,
    );
    const ownerRole = await createRole('OWNER');
    await assignRole(user.userId, box.boxBottomId, ownerRole!.roleId);
    const response = await request(app)
      .delete(`/users/${user.userId}`)
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(200);
    expect(await DB.BoxBottoms.findByPk(box.boxBottomId)).toBeNull();
    expect(await DB.Categories.findByPk(category.categoryId)).toBeNull();
    expect(
      await DB.Transactions.findByPk(transaction.transactionId),
    ).toBeNull();
    expect(
      await DB.RoleUserBoxBottoms.count({ where: { userId: user.userId } }),
    ).toBe(0);
  });

  it('I41 - remover category pela API remove transações por cascade', async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const category = await createCategory(user.userId);
    const transaction = await createTransaction(
      box.boxBottomId,
      category.categoryId,
    );
    const response = await request(app)
      .delete(`/categories/${category.categoryId}`)
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(200);
    expect(
      await DB.Transactions.findByPk(transaction.transactionId),
    ).toBeNull();
  });

  it('I42 - remover box remove transações e permissões relacionadas por cascade', async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const category = await createCategory(user.userId);
    const transaction = await createTransaction(
      box.boxBottomId,
      category.categoryId,
    );
    const role = await createRole('OWNER');
    await assignRole(user.userId, box.boxBottomId, role!.roleId);
    const response = await request(app)
      .delete(`/box-bottoms/${box.boxBottomId}`)
      .set(authHeader(tokenFor(user)));
    expect(response.status).toBe(200);
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
