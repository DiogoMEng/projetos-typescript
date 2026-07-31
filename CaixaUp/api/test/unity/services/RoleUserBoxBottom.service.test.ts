import { describe, it, expect, beforeEach, jest } from '@jest/globals';

const mockDb = {
  RoleUserBoxBottoms: {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'RoleUserBoxBottoms',
  },
  Users: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Users',
  },
  BoxBottoms: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'BoxBottoms',
  },
  Roles: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Roles',
  },
};

jest.unstable_mockModule('#models/index.js', () => ({ DB: mockDb }));

const { default: RoleUserBoxBottomService } = await import('#services/RoleUserBoxBottom.service.js');

describe('RoleUserBoxBottomService unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('U19 - beforeCreate lança erro quando o usuário não existe', async () => {
    mockDb.Users.findByPk.mockResolvedValue(null);
    mockDb.BoxBottoms.findByPk.mockResolvedValue({ boxBottomId: 'b1' });
    mockDb.Roles.findByPk.mockResolvedValue({ roleId: 'r1' });
    const service = new RoleUserBoxBottomService() as any;

    await expect(service.beforeCreate({ userId: 'u1', boxBottomId: 'b1', roleId: 'r1' })).rejects.toThrow('Usuário, Caixa ou Função não encontrados');
  });

  it('U19 - beforeCreate lança erro quando a caixa não existe', async () => {
    mockDb.Users.findByPk.mockResolvedValue({ userId: 'u1' });
    mockDb.BoxBottoms.findByPk.mockResolvedValue(null);
    mockDb.Roles.findByPk.mockResolvedValue({ roleId: 'r1' });
    const service = new RoleUserBoxBottomService() as any;

    await expect(service.beforeCreate({ userId: 'u1', boxBottomId: 'b1', roleId: 'r1' })).rejects.toThrow('Usuário, Caixa ou Função não encontrados');
  });

  it('U19 - beforeCreate lança erro quando a função não existe', async () => {
    mockDb.Users.findByPk.mockResolvedValue({ userId: 'u1' });
    mockDb.BoxBottoms.findByPk.mockResolvedValue({ boxBottomId: 'b1' });
    mockDb.Roles.findByPk.mockResolvedValue(null);
    const service = new RoleUserBoxBottomService() as any;

    await expect(service.beforeCreate({ userId: 'u1', boxBottomId: 'b1', roleId: 'r1' })).rejects.toThrow('Usuário, Caixa ou Função não encontrados');
  });

  it('U20 - beforeCreate não lança erro quando usuário, caixa e função existem', async () => {
    mockDb.Users.findByPk.mockResolvedValue({ userId: 'u1' });
    mockDb.BoxBottoms.findByPk.mockResolvedValue({ boxBottomId: 'b1' });
    mockDb.Roles.findByPk.mockResolvedValue({ roleId: 'r1' });
    mockDb.RoleUserBoxBottoms.findOne.mockResolvedValue(null);
    const service = new RoleUserBoxBottomService() as any;

    await expect(service.beforeCreate({ userId: 'u1', boxBottomId: 'b1', roleId: 'r1' })).resolves.toBeUndefined();
  });

  it('U21 - beforeCreate impede duplicar o vínculo quando já existe permissão', async () => {
    mockDb.Users.findByPk.mockResolvedValue({ userId: 'u1' });
    mockDb.BoxBottoms.findByPk.mockResolvedValue({ boxBottomId: 'b1' });
    mockDb.Roles.findByPk.mockResolvedValue({ roleId: 'r1' });
    mockDb.RoleUserBoxBottoms.findOne.mockResolvedValue({ roleUserBoxBottomId: 'existing' });
    const service = new RoleUserBoxBottomService() as any;

    await expect(service.beforeCreate({ userId: 'u1', boxBottomId: 'b1', roleId: 'r1' })).rejects.toThrow('O usuário já possui permissão nesta caixa.');
  });
});
