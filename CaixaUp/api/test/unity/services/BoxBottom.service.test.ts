import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Op } from 'sequelize';
import { Service } from '#services/Service.js';

const mockDb = {
  BoxBottoms: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'BoxBottoms',
  },
  Roles: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Roles',
  },
  RoleUserBoxBottoms: {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'RoleUserBoxBottoms',
  },
  Users: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Users',
  },
};

const mockRoleUserBoxBottomService = {
  create: jest.fn(),
};

jest.unstable_mockModule('#models/index.js', () => ({ DB: mockDb }));
jest.unstable_mockModule('#services/RoleUserBoxBottom.service.js', () => ({
  default: jest.fn().mockImplementation(() => mockRoleUserBoxBottomService),
}));

const { default: BoxBottomService } = await import('#services/BoxBottom.service.js');

describe('BoxBottomService unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('U13 - beforeCreate lança erro quando a caixinha já existe para o usuário', async () => {
    mockDb.BoxBottoms.findOne.mockResolvedValue({ boxBottomId: 'existing' });
    const service = new BoxBottomService() as any;

    await expect(service.beforeCreate({ name: 'Caixinha', userId: 'u1' })).rejects.toThrow('Caixinha já existe para este usuário');
  });

  it('U14 - beforeCreate não lança erro quando não há conflito', async () => {
    mockDb.BoxBottoms.findOne.mockResolvedValue(null);
    const service = new BoxBottomService() as any;

    await expect(service.beforeCreate({ name: 'Nova', userId: 'u1' })).resolves.toBeUndefined();
  });

  it('U15 - afterCreate busca a role OWNER e cria o vínculo correto', async () => {
    mockDb.Roles.findOne.mockResolvedValue({ roleId: 'owner-role' });
    mockRoleUserBoxBottomService.create.mockResolvedValue(undefined);
    const service = new BoxBottomService() as any;

    await service.afterCreate({ userId: 'u1', boxBottomId: 'b1' });

    expect(mockDb.Roles.findOne).toHaveBeenCalledWith({ where: { name: 'OWNER' } });
    expect(mockRoleUserBoxBottomService.create).toHaveBeenCalledWith({
      userId: 'u1',
      boxBottomId: 'b1',
      roleId: 'owner-role',
    });
  });

  it('U16 - afterCreate lança erro quando a role OWNER não existe', async () => {
    mockDb.Roles.findOne.mockResolvedValue(null);
    const service = new BoxBottomService() as any;

    await expect(service.afterCreate({ userId: 'u1', boxBottomId: 'b1' })).rejects.toThrow('Role OWNER não encontrada');
  });

  it('U17 - afterCreate acessa userId e boxBottomId do registro criado', async () => {
    mockDb.Roles.findOne.mockResolvedValue({ roleId: 'owner-role' });
    mockRoleUserBoxBottomService.create.mockResolvedValue(undefined);
    const service = new BoxBottomService() as any;

    await expect(service.afterCreate({ userId: 'u1', boxBottomId: 'b1' })).resolves.toBeUndefined();
  });

  it('U18 - getAllBoxBottomsByUser monta o where com Op.or e os includes corretos', async () => {
    const getAllSpy = jest.spyOn(Service.prototype as any, 'getAll').mockResolvedValue([]);
    const service = new BoxBottomService();

    await service.getAllBoxBottomsByUser('u1');

    expect(getAllSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        [Op.or]: [
          { userId: 'u1' },
          { '$boxMembers.user_id$': 'u1' },
        ],
      }),
      include: expect.any(Array),
      distinct: true,
      subQuery: false,
    }));

    getAllSpy.mockRestore();
  });
});
