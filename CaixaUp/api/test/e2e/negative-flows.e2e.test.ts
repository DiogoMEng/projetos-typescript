import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import type { Server } from 'node:http';
import { DB } from '#models/index.js';
import app from '../../src/app.js';
import {
  authorization,
  countTransactions,
  createBox,
  createCategory,
  createTransaction,
  registerAndLogin,
} from './helpers/client.js';
import { useE2eDatabase } from './helpers/database.js';

useE2eDatabase();

let server: Server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe('CaixaUp E2E - caminhos negativos e borda', () => {
  it('E8 - trata JSON inválido e Content-Type incorreto em cada rota POST', async () => {
    const owner = await registerAndLogin(
      server,
      'e8-owner@example.com',
      'E8 Owner',
    );
    const boxBottomId = await createBox(server, owner.token, 'E8 Caixa');
    const categoryId = await createCategory(
      server,
      owner.token,
      'E8 Categoria',
      'receita',
    );
    const postPaths = [
      '/auth/login',
      '/users',
      '/categories',
      '/box-bottoms',
      `/transactions/box-bottom/${boxBottomId}/category/${categoryId}`,
      '/roles/register',
      `/permissions/box-bottom/${boxBottomId}/register/`,
    ];

    for (const path of postPaths) {
      const malformed = await request(server)
        .post(path)
        .set(authorization(owner.token))
        .set('Content-Type', 'application/json')
        .send('{malformed');
      expect(malformed.status).toBe(400);

      const wrongContentType = await request(server)
        .post(path)
        .set(authorization(owner.token))
        .set('Content-Type', 'text/plain')
        .send('this is not a JSON request body');
      expect(wrongContentType.status).toBe(422);
    }
  });

  it('E9 - registra várias transações em sequência sem IDs duplicados', async () => {
    const owner = await registerAndLogin(
      server,
      'e9-owner@example.com',
      'E9 Owner',
    );
    const boxBottomId = await createBox(server, owner.token, 'E9 Volume');
    const incomeCategoryId = await createCategory(
      server,
      owner.token,
      'E9 Entradas',
      'receita',
    );
    const expenseCategoryId = await createCategory(
      server,
      owner.token,
      'E9 Saídas',
      'despesa',
    );
    const transactionIds: string[] = [];

    for (let index = 0; index < 12; index += 1) {
      const isIncome = index < 6;
      const response = await createTransaction(
        server,
        owner.token,
        boxBottomId,
        isIncome ? incomeCategoryId : expenseCategoryId,
        isIncome ? 'inflow' : 'outflow',
        isIncome ? 10 : 3,
        `E9 transação ${index}`,
      );
      expect(response.status).toBe(201);
      transactionIds.push(response.body.data.transactionId);
    }

    expect(new Set(transactionIds).size).toBe(12);
    const listing = await request(server)
      .get(`/transactions/box-bottom/${boxBottomId}`)
      .set(authorization(owner.token));
    expect(listing.status).toBe(200);
    expect(listing.body).toHaveLength(12);
    expect(await countTransactions()).toBe(12);
    const balance = listing.body.reduce(
      (total: number, transaction: { movementType: string; value: number }) =>
        total +
        (transaction.movementType === 'inflow'
          ? Number(transaction.value)
          : -Number(transaction.value)),
      0,
    );
    expect(balance).toBe(42);
  });

  it('E10 - rejeita transação logo após remover a caixinha', async () => {
    const owner = await registerAndLogin(
      server,
      'e10-owner@example.com',
      'E10 Owner',
    );
    const boxBottomId = await createBox(server, owner.token, 'E10 Removida');
    const categoryId = await createCategory(
      server,
      owner.token,
      'E10 Categoria',
      'receita',
    );
    const deletion = await request(server)
      .delete(`/box-bottoms/${boxBottomId}`)
      .set(authorization(owner.token));
    expect(deletion.status).toBe(200);

    const transaction = await createTransaction(
      server,
      owner.token,
      boxBottomId,
      categoryId,
      'inflow',
      10,
      'E10 operação inválida após exclusão',
    );
    expect(transaction.status).toBe(403);
    expect(await DB.Transactions.count()).toBe(0);
  });
});
