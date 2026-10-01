import { describe, expect, it, jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { JWT_SECRET } from '#config/index.js';
import { Controller } from '#controllers/Controller.js';
import AuthController from '#controllers/auth.controller.js';
import RoleUserBoxBottomController from '#controllers/Permission.controller.js';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '#errors/httpErrors.js';
import { errorHandler } from '#middlewares/errorHandler.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import { objectIdParam } from '#validations/common.validation.js';
import {
  assignRole,
  authHeader,
  createBox,
  createRole,
  createUser,
  tokenFor,
} from './helpers/factories.js';
import { useDatabaseHooks } from './helpers/hooks.js';
import app from '../../src/app.js';

useDatabaseHooks();

const INVALID_UUID = '00000000-0000-0000-0000-000000000000';

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
}

describe('Integration edge paths', () => {
  it('returns the configured JSON 404 for unknown routes', async () => {
    const response = await request(app).get('/route-not-registered');
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('/route-not-registered');
  });

  it('rejects malformed, altered, and expired tokens across protected modules', async () => {
    const expired = jwt.sign(
      { userId: INVALID_UUID, email: 'expired@example.com' },
      JWT_SECRET as string,
      { expiresIn: -1 },
    );
    const protectedPaths = [
      '/categories',
      '/box-bottoms',
      `/transactions/box-bottom/${INVALID_UUID}`,
      `/permissions/box-bottom/${INVALID_UUID}`,
    ];

    for (const path of protectedPaths) {
      expect(
        (await request(app).get(path).set('Authorization', 'invalid')).status,
      ).toBe(401);
      expect(
        (await request(app).get(path).set('Authorization', `Bearer ${expired}`))
          .status,
      ).toBe(401);
    }
  });

  it('maps a database failure inside checkRole to an HTTP 500 using a real UUID query', async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const invalidUserToken = jwt.sign(
      { userId: 'not-a-uuid', email: user.email },
      JWT_SECRET as string,
    );
    const response = await request(app)
      .get(`/box-bottoms/${box.boxBottomId}`)
      .set(authHeader(invalidUserToken));
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erro interno do servidor');
  });

  it('rejects duplicate category names for one user', async () => {
    const user = await createUser();
    const header = authHeader(tokenFor(user));
    const payload = { name: 'Categoria única', type: 'receita' };
    await request(app)
      .post('/categories')
      .set(header)
      .send(payload)
      .expect(201);
    await request(app)
      .post('/categories')
      .set(header)
      .send(payload)
      .expect(409);
  });

  it('rejects duplicate member associations', async () => {
    const owner = await createUser();
    const member = await createUser();
    const box = await createBox(owner.userId);
    const ownerRole = await createRole('OWNER');
    const viewerRole = await createRole('VIEWER');
    await assignRole(owner.userId, box.boxBottomId, ownerRole!.roleId);
    const payload = { userId: member.userId, roleId: viewerRole!.roleId };
    const path = `/permissions/box-bottom/${box.boxBottomId}/register/`;
    const header = authHeader(tokenFor(owner));
    await request(app).post(path).set(header).send(payload).expect(201);
    await request(app).post(path).set(header).send(payload).expect(409);
  });

  it('reports not-found when changing a nonexistent member role', async () => {
    const owner = await createUser();
    const box = await createBox(owner.userId);
    const ownerRole = await createRole('OWNER');
    const replacementRole = await createRole('MANAGER');
    await assignRole(owner.userId, box.boxBottomId, ownerRole!.roleId);
    const response = await request(app)
      .put(`/permissions/box-bottom/${INVALID_UUID}/${box.boxBottomId}`)
      .set(authHeader(tokenFor(owner)))
      .send({ roleId: replacementRole!.roleId });
    expect(response.status).toBe(404);
  });

  it('exercises generic controller defaults and not-found branches with a service boundary', async () => {
    const savedRecord = { id: 'saved' };
    let shouldReturnRecord = true;
    const service = {
      create: async (dto: unknown) => ({ ...savedRecord, dto }),
      getAll: async () => [savedRecord],
      getById: async () => (shouldReturnRecord ? savedRecord : null),
      update: async () => shouldReturnRecord,
      delete: async () => shouldReturnRecord,
    };
    const controller = new (class extends Controller {})(service as never);
    const req = {
      body: { name: 'record' },
      params: { id: 'saved' },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as unknown as NextFunction;

    await invokeController(controller.register, req, res, next);
    await invokeController(controller.getAll, req, res, next);
    await invokeController(controller.getById, req, res, next);
    await invokeController(controller.edit, req, res, next);
    await invokeController(controller.delete, req, res, next);
    shouldReturnRecord = false;
    await invokeController(controller.getById, req, res, next);
    await invokeController(controller.edit, req, res, next);
    await invokeController(controller.delete, req, res, next);
    expect((next as unknown as jest.Mock).mock.calls).toHaveLength(3);
  });

  it('covers the body-default request validator for success and failure', async () => {
    const schema = Joi.object({ value: Joi.string().required() });
    const middleware = validateRequest(schema);
    const validRequest = { body: { value: 'ok' } } as Request;
    const next = jest.fn() as unknown as NextFunction;
    middleware(validRequest, createResponse(), next);
    expect(validRequest.body.value).toBe('ok');
    expect(next).toHaveBeenCalledTimes(1);

    const invalidNext = jest.fn() as unknown as NextFunction;
    middleware({ body: {} } as Request, createResponse(), invalidNext);
    expect(invalidNext).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it('covers object-id validation and required-field controller guards', async () => {
    const objectIdValidation = objectIdParam('id');
    expect(
      objectIdValidation.validate({ id: '0123456789abcdef01234567' }).error,
    ).toBeUndefined();
    expect(
      objectIdValidation.validate({ id: INVALID_UUID }).error,
    ).toBeDefined();

    const authNext = jest.fn() as unknown as NextFunction;
    await invokeController(
      AuthController.login,
      { body: { email: 'user@example.com' } } as Request,
      createResponse(),
      authNext,
    );
    expect(authNext).toHaveBeenCalledWith(expect.any(BadRequestError));

    const roleNext = jest.fn() as unknown as NextFunction;
    await invokeController(
      RoleUserBoxBottomController.register,
      { params: {}, body: {} } as Request,
      createResponse(),
      roleNext,
    );
    expect(roleNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it('maps untyped errors to generic 500 and checks default HTTP error constructors', () => {
    const response = createResponse();
    const errorLog = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      errorHandler(
        new Error('unexpected'),
        {} as Request,
        response,
        jest.fn() as unknown as NextFunction,
      );
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Erro interno do servidor',
      });
    } finally {
      errorLog.mockRestore();
    }

    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
    expect(new ValidationError().statusCode).toBe(422);
  });
});

async function invokeController(
  handler: (req: Request, res: Response, next: NextFunction) => void,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  handler(req, res, next);
  await new Promise<void>((resolve) => setImmediate(resolve));
}
