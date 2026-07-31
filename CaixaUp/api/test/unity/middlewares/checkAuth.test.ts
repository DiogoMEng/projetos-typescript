import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

jest.unstable_mockModule('#config/index.js', () => ({ JWT_SECRET: 'test-secret' }));

const { default: checkAuth } = await import('#middlewares/checkAuth.js');

describe('checkAuth middleware unit tests', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('U28 - retorna 401 quando o header Authorization está ausente', async () => {
    await checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('U29 - retorna 401 quando o token está mal formatado', async () => {
    req.headers.authorization = 'InvalidHeader';

    await checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('U30 - retorna 401 quando o token expirou', async () => {
    const expiredToken = jwt.sign({ userId: 'u1', email: 'ana@test.com' }, 'test-secret', { expiresIn: -1 });
    req.headers.authorization = `Bearer ${expiredToken}`;

    await checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('U31 - define req.userId e chama next quando o token é válido', async () => {
    const token = jwt.sign({ userId: 'u1', email: 'ana@test.com' }, 'test-secret');
    req.headers.authorization = `Bearer ${token}`;

    await checkAuth(req, res, next);

    expect(req.userId).toBe('u1');
    expect(req.email).toBe('ana@test.com');
    expect(next).toHaveBeenCalled();
  });

  it('U32 - retorna 401 quando o token é assinado com segredo diferente', async () => {
    const token = jwt.sign({ userId: 'u1', email: 'ana@test.com' }, 'other-secret');
    req.headers.authorization = `Bearer ${token}`;

    await checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
