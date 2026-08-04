import { describe, it, expect, beforeEach, jest } from '@jest/globals';

const mockDb = {
  Users: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Users',
  },
  Categories: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Categories',
  },
  BoxBottoms: {
    findByPk: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'BoxBottoms',
  },
  Transactions: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    name: 'Transactions',
  },
  Roles: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
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
};

const mockHash = jest.fn();

jest.unstable_mockModule('#models/index.js', () => ({ DB: mockDb }));
jest.unstable_mockModule('bcryptjs', () => ({ hash: mockHash }));

const { default: UserService } = await import('#services/User.service.js');
const { default: CategoryService } = await import('#services/Category.service.js');
const { default: TransactionService } = await import('#services/Transaction.service.js');
const { default: RoleService } = await import('#services/role.service.js');

describe('Domain services unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('U22 - UserService hasheia a senha antes de persistir', async () => {
    mockHash.mockResolvedValue('hashed-password');
    mockDb.Users.findOne.mockResolvedValue(null);
    mockDb.Users.create.mockResolvedValue({ userId: 'u1' });

    const service = new UserService();
    await service.create({ name: 'Ana', email: 'ana@test.com', password: '12345678' } as any);

    expect(mockHash).toHaveBeenCalledWith('12345678', 8);
    expect(mockDb.Users.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashed-password' }));
  });

  it('U23 - getAllUsers nunca inclui o campo password', async () => {
    const service = new UserService();
    const users = [{ name: 'Ana', password: 'secret' }];
    mockDb.Users.findAll.mockResolvedValue(users);

    await expect(service.getAllUsers()).resolves.toBe(users);
    expect(mockDb.Users.findAll).toHaveBeenCalledWith({ attributes: { exclude: ['password'] } });
  });

  it('U24 - CategoryService rejeita tipo inválido fora do enum', async () => {
    const service = new CategoryService();

    await expect(service.create({ name: 'Salário', type: 'outro', userId: 'u1' } as any)).rejects.toThrow();
  });

  it('U25 - TransactionService persiste os IDs da transação corretamente', async () => {
    mockDb.BoxBottoms.findByPk.mockResolvedValue({ boxBottomId: 'route-box' });
    mockDb.Categories.findByPk.mockResolvedValue({ categoryId: 'route-cat' });
    mockDb.Transactions.create.mockResolvedValue({ transactionId: 't1' });

    const service = new TransactionService();
    await service.create({
      boxBottomId: 'route-box',
      categoryId: 'route-cat',
      value: 100,
      transactionDate: '2024-01-01',
      description: 'salario',
    } as any);

    expect(mockDb.Transactions.create).toHaveBeenCalledWith(expect.objectContaining({
      boxBottomId: 'route-box',
      categoryId: 'route-cat',
    }));
  });

  it('U26 - TransactionService rejeita movementType inválido', async () => {
    const service = new TransactionService();

    await expect(service.create({
      boxBottomId: 'route-box',
      categoryId: 'route-cat',
      movementType: 'invalid',
      value: 100,
      transactionDate: '2024-01-01',
      description: 'erro',
    } as any)).rejects.toThrow();
  });

  it('U27 - RoleService rejeita criação de role com nome duplicado', async () => {
    const service = new RoleService();

    await expect(service.create({ name: 'OWNER' } as any)).rejects.toThrow();
  });
});
