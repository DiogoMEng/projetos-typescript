import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import type { Server } from 'node:http';
import app from '../../src/app.js';
import {
  authorization,
  createBox,
  createCategory,
  createTransaction,
  getRoleId,
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

describe('CaixaUp E2E', () => {
  it('E1 - cadastro, login, criação de caixinha e verificação do owner', async () => {
    const agent = request(server);
    const registration = await agent.post('/users').send({
      name: 'E2E Owner',
      email: 'e1-owner@example.com',
      password: 'SenhaSegura123',
    });
    expect(registration.status).toBe(201);

    const login = await agent.post('/auth/login').send({
      email: 'e1-owner@example.com',
      password: 'SenhaSegura123',
    });
    expect(login.status).toBe(200);
    const authorization = { Authorization: `Bearer ${login.body.accessToken}` };

    const creation = await agent.post('/box-bottoms').set(authorization).send({
      name: 'E1 Reserva',
      description: 'Reserva familiar',
      targetValue: 800,
    });
    expect(creation.status).toBe(201);
    expect(creation.body.boxBottomId).toEqual(expect.any(String));

    const boxes = await agent.get('/box-bottoms').set(authorization);
    expect(boxes.status).toBe(200);
    expect(
      boxes.body.map((box: { boxBottomId: string }) => box.boxBottomId),
    ).toContain(creation.body.boxBottomId);

    const permissions = await agent
      .get(`/permissions/box-bottom/${creation.body.boxBottomId}`)
      .set(authorization);
    expect(permissions.status).toBe(200);
    expect(permissions.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          assignedRole: expect.objectContaining({ name: 'OWNER' }),
        }),
      ]),
    );
  });

  it('E2 - completa um fluxo financeiro de entrada e saída', async () => {
    const account = await registerAndLogin(
      server,
      'e2-finance@example.com',
      'E2 Finance',
    );
    const incomeCategory = await createCategory(
      server,
      account.token,
      'E2 Salário',
      'receita',
    );
    const boxBottomId = await createBox(server, account.token, 'E2 Orçamento');
    const income = await createTransaction(
      server,
      account.token,
      boxBottomId,
      incomeCategory,
      'inflow',
      100,
      'E2 salário',
    );
    expect(income.status).toBe(201);

    const expenseCategory = await createCategory(
      server,
      account.token,
      'E2 Mercado',
      'despesa',
    );
    const expense = await createTransaction(
      server,
      account.token,
      boxBottomId,
      expenseCategory,
      'outflow',
      25,
      'E2 compras',
    );
    expect(expense.status).toBe(201);

    const listing = await request(server)
      .get(`/transactions/box-bottom/${boxBottomId}`)
      .set(authorization(account.token));
    expect(listing.status).toBe(200);
    expect(listing.body).toHaveLength(2);
    const balance = listing.body.reduce(
      (total: number, transaction: { movementType: string; value: number }) =>
        total +
        (transaction.movementType === 'inflow'
          ? Number(transaction.value)
          : -Number(transaction.value)),
      0,
    );
    expect(balance).toBe(75);
  });

  it('E3 - compartilha uma caixinha com viewer sem conceder delete', async () => {
    const owner = await registerAndLogin(
      server,
      'e3-owner@example.com',
      'E3 Owner',
    );
    const member = await registerAndLogin(
      server,
      'e3-viewer@example.com',
      'E3 Viewer',
    );
    const boxBottomId = await createBox(
      server,
      owner.token,
      'E3 Compartilhada',
    );
    const viewerRoleId = await getRoleId(server, 'VIEWER');
    const permission = await request(server)
      .post(`/permissions/box-bottom/${boxBottomId}/register/`)
      .set(authorization(owner.token))
      .send({ userId: member.userId, roleId: viewerRoleId });
    expect(permission.status).toBe(201);

    const memberBoxes = await request(server)
      .get('/box-bottoms')
      .set(authorization(member.token));
    expect(
      memberBoxes.body.map((box: { boxBottomId: string }) => box.boxBottomId),
    ).toContain(boxBottomId);
    expect(
      (
        await request(server)
          .delete(`/box-bottoms/${boxBottomId}`)
          .set(authorization(member.token))
      ).status,
    ).toBe(403);
  });

  it('E4 - mantém isolamento entre usuários em recursos por ID', async () => {
    const owner = await registerAndLogin(
      server,
      'e4-owner@example.com',
      'E4 Owner',
    );
    const stranger = await registerAndLogin(
      server,
      'e4-stranger@example.com',
      'E4 Stranger',
    );
    const boxBottomId = await createBox(server, owner.token, 'E4 Privada');
    const categoryId = await createCategory(
      server,
      owner.token,
      'E4 Privada',
      'receita',
    );
    const transaction = await createTransaction(
      server,
      owner.token,
      boxBottomId,
      categoryId,
      'inflow',
      40,
      'E4 privado',
    );
    const transactionId = transaction.body.data.transactionId;
    const strangerHeader = authorization(stranger.token);

    expect(
      (
        await request(server)
          .get(`/box-bottoms/${boxBottomId}`)
          .set(strangerHeader)
      ).status,
    ).toBe(403);
    expect(
      (
        await request(server)
          .put(`/box-bottoms/${boxBottomId}`)
          .set(strangerHeader)
          .send({ name: 'Alterada' })
      ).status,
    ).toBe(403);
    expect(
      (
        await request(server)
          .delete(`/box-bottoms/${boxBottomId}`)
          .set(strangerHeader)
      ).status,
    ).toBe(403);
    expect(
      (
        await request(server)
          .get(`/categories/${categoryId}`)
          .set(strangerHeader)
      ).status,
    ).toBe(404);
    expect(
      (
        await request(server)
          .put(`/categories/${categoryId}`)
          .set(strangerHeader)
          .send({ name: 'Alterada' })
      ).status,
    ).toBe(404);
    expect(
      (
        await request(server)
          .delete(`/categories/${categoryId}`)
          .set(strangerHeader)
      ).status,
    ).toBe(404);
    expect(
      (
        await request(server)
          .get(`/transactions/${transactionId}/box-bottom/${boxBottomId}`)
          .set(strangerHeader)
      ).status,
    ).toBe(403);
    expect(
      (
        await request(server)
          .put(`/transactions/${transactionId}/box-bottom/${boxBottomId}`)
          .set(strangerHeader)
          .send({ description: 'Alterada' })
      ).status,
    ).toBe(403);
    expect(
      (
        await request(server)
          .delete(`/transactions/${transactionId}/box-bottom/${boxBottomId}`)
          .set(strangerHeader)
      ).status,
    ).toBe(403);
  });
});
