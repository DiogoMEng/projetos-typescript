import { describe, it, expect, beforeEach, jest } from '@jest/globals';

const mockDb = {
  Users: {
    findOne: jest.fn(),
  },
  RoleUserBoxBottoms: {},
  Roles: {},
};

jest.unstable_mockModule('#models/index.js', () => ({ DB: mockDb }));

const { default: checkRole } = await import('#middlewares/checkRole.js');

describe('checkRole middleware unit tests', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { userId: 'u1', params: { boxBottomId: 'b1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('U33 - retorna 403 quando o usuário não possui a role exigida', async () => {
    mockDb.Users.findOne.mockResolvedValue({
      userId: 'u1',
      userPermissions: [{ assignedRole: { name: 'MEMBER' } }],
    });

    await checkRole(['OWNER'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('U34 - chama next quando o usuário possui a role exigida', async () => {
    mockDb.Users.findOne.mockResolvedValue({
      userId: 'u1',
      userPermissions: [{ assignedRole: { name: 'OWNER' } }],
    });

    await checkRole(['OWNER'])(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('U35 - retorna 403 quando o usuário nunca foi associado à caixa', async () => {
    mockDb.Users.findOne.mockResolvedValue(null);

    await checkRole(['OWNER'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
