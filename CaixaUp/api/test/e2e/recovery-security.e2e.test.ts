import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import type { Server } from 'node:http';
import { JWT_SECRET } from '#config/index.js';
import app from '../../src/app.js';
import {
  authorization,
  createBox,
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

describe('CaixaUp E2E - recuperação e segurança', () => {
  it('E5 - rejeita caixinha duplicada sem deixar recurso órfão', async () => {
    const owner = await registerAndLogin(
      server,
      'e5-owner@example.com',
      'E5 Owner',
    );
    const name = 'E5 Nome repetido';
    const boxBottomId = await createBox(server, owner.token, name);
    const duplicate = await request(server)
      .post('/box-bottoms')
      .set(authorization(owner.token))
      .send({ name, description: 'Segunda tentativa', targetValue: 200 });
    expect(duplicate.status).toBe(409);

    const boxes = await request(server)
      .get('/box-bottoms')
      .set(authorization(owner.token));
    expect(
      boxes.body.filter((box: { name: string }) => box.name === name),
    ).toHaveLength(1);
    const permissions = await request(server)
      .get(`/permissions/box-bottom/${boxBottomId}`)
      .set(authorization(owner.token));
    expect(permissions.body).toHaveLength(1);
    expect(permissions.body[0].assignedRole.name).toBe('OWNER');
  });

  it('E6 - rejeita tokens expirados e adulterados em rotas protegidas', async () => {
    const payload = {
      userId: '00000000-0000-0000-0000-000000000001',
      email: 'e6@example.com',
    };
    const expiredToken = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: -1,
    });
    const signedToken = jwt.sign(payload, JWT_SECRET as string);
    const alteredToken = `${signedToken.slice(0, -2)}xx`;
    const protectedPaths = [
      '/categories',
      '/box-bottoms',
      '/transactions/box-bottom/00000000-0000-0000-0000-000000000001',
      '/permissions/box-bottom/00000000-0000-0000-0000-000000000001',
    ];

    for (const path of protectedPaths) {
      expect(
        (await request(server).get(path).set(authorization(expiredToken)))
          .status,
      ).toBe(401);
      expect(
        (await request(server).get(path).set(authorization(alteredToken)))
          .status,
      ).toBe(401);
    }
  });

  it('E7 - confirma via HTTP o ID salvo e a permission OWNER', async () => {
    const owner = await registerAndLogin(
      server,
      'e7-owner@example.com',
      'E7 Owner',
    );
    const createdBoxId = await createBox(server, owner.token, 'E7 Persistida');
    const fetchedBox = await request(server)
      .get(`/box-bottoms/${createdBoxId}`)
      .set(authorization(owner.token));
    expect(fetchedBox.status).toBe(200);
    expect(fetchedBox.body.boxBottomId).toBe(createdBoxId);

    const permissions = await request(server)
      .get(`/permissions/box-bottom/${createdBoxId}`)
      .set(authorization(owner.token));
    expect(permissions.body[0]).toMatchObject({
      userId: owner.userId,
      boxBottomId: createdBoxId,
      assignedRole: { name: 'OWNER' },
    });
  });
});
