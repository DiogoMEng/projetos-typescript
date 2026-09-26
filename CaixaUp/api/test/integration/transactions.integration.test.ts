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

async function ownedFixture() {
  const user = await createUser();
  const box = await createBox(user.userId);
  const role = await createRole('OWNER');
  await assignRole(user.userId, box.boxBottomId, role!.roleId);
  const category = await createCategory(user.userId);
  return { user, box, category, token: tokenFor(user) };
}

const transactionBody = {
  movementType: 'inflow',
  value: 20,
  transactionDate: '2026-01-01',
  description: 'Entrada',
};

describe('Transactions - integração', () => {
  it('I27 - cria transação com IDs das URLs', async () => {
    const fixture = await ownedFixture();
    const response = await request(app)
      .post(
        `/transactions/box-bottom/${fixture.box.boxBottomId}/category/${fixture.category.categoryId}`,
      )
      .set(authHeader(fixture.token))
      .send(transactionBody);
    expect(response.status).toBe(201);
    expect(response.body.data.boxBottomId).toBe(fixture.box.boxBottomId);
    expect(response.body.data.categoryId).toBe(fixture.category.categoryId);
  });

  it('I28 - rejeita box inexistente', async () => {
    const fixture = await ownedFixture();
    const response = await request(app)
      .post(
        `/transactions/box-bottom/00000000-0000-0000-0000-000000000000/category/${fixture.category.categoryId}`,
      )
      .set(authHeader(fixture.token))
      .send(transactionBody);
    expect(response.status).toBe(403);
  });

  it('I29 - rejeita categoria inexistente', async () => {
    const fixture = await ownedFixture();
    const response = await request(app)
      .post(
        `/transactions/box-bottom/${fixture.box.boxBottomId}/category/00000000-0000-0000-0000-000000000000`,
      )
      .set(authHeader(fixture.token))
      .send(transactionBody);
    expect(response.status).toBe(404);
  });

  it('I30 - bloqueia transação em box de outro usuário', async () => {
    const owner = await ownedFixture();
    const other = await createUser();
    const category = await createCategory(other.userId);
    const response = await request(app)
      .post(
        `/transactions/box-bottom/${owner.box.boxBottomId}/category/${category.categoryId}`,
      )
      .set(authHeader(tokenFor(other)))
      .send(transactionBody);
    expect(response.status).toBe(403);
  });

  it('I31 - rejeita movementType inválido', async () => {
    const fixture = await ownedFixture();
    const response = await request(app)
      .post(
        `/transactions/box-bottom/${fixture.box.boxBottomId}/category/${fixture.category.categoryId}`,
      )
      .set(authHeader(fixture.token))
      .send({ ...transactionBody, movementType: 'invalid' });
    expect(response.status).toBe(422);
  });

  it('I32 - lista transações da caixinha', async () => {
    const fixture = await ownedFixture();
    await createTransaction(
      fixture.box.boxBottomId,
      fixture.category.categoryId,
    );
    const response = await request(app)
      .get(`/transactions/box-bottom/${fixture.box.boxBottomId}`)
      .set(authHeader(fixture.token));
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].boxBottomId).toBe(fixture.box.boxBottomId);
  });

  it('I33 - edita e remove transação pelo caminho real', async () => {
    const fixture = await ownedFixture();
    const transaction = await createTransaction(
      fixture.box.boxBottomId,
      fixture.category.categoryId,
    );
    const path = `/transactions/${transaction.transactionId}/box-bottom/${fixture.box.boxBottomId}`;
    expect(
      (
        await request(app)
          .put(path)
          .set(authHeader(fixture.token))
          .send({ description: 'Editada' })
      ).status,
    ).toBe(200);
    expect(
      (await request(app).delete(path).set(authHeader(fixture.token))).status,
    ).toBe(200);
    expect(
      await DB.Transactions.findByPk(transaction.transactionId),
    ).toBeNull();
  });
});
