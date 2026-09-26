import { describe, expect, it } from '@jest/globals';
import { DB } from '#models/index.js';
import type { User } from '#interfaces/user.interface.js';
import BoxBottomService from '#services/BoxBottom.service.js';
import CategoryService from '#services/Category.service.js';
import RoleUserBoxBottomService from '#services/RoleUserBoxBottom.service.js';
import { Service } from '#services/Service.js';
import TransactionService from '#services/Transaction.service.js';
import {
  assignRole,
  createBox,
  createCategory,
  createRole,
  createTransaction,
  createUser,
} from './helpers/factories.js';
import { useDatabaseHooks } from './helpers/hooks.js';
import { UserModel } from '../../src/database/models/User.model.js';

useDatabaseHooks();

const INVALID_UUID = '00000000-0000-0000-0000-000000000000';

describe('Services - integração e bordas', () => {
  it('rejects category types invalid at the service boundary', async () => {
    const service = new CategoryService();
    await expect(
      service.create({
        name: 'Tipo inválido',
        type: 'transferência',
        userId: INVALID_UUID,
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('supports caller-owned box transactions and owner hooks without transactions', async () => {
    const user = await createUser();
    const service = new BoxBottomService();
    const transaction = await DB.sequelize.transaction();
    const box = await service.create(
      {
        name: 'Transação externa',
        description: 'Teste',
        targetValue: 10,
        userId: user.userId,
      },
      { transaction },
    );
    await transaction.commit();
    expect(box.userId).toBe(user.userId);

    const rawBox = await createBox(user.userId, 'Hook sem transação');
    await (
      service as unknown as {
        afterCreate: (record: typeof rawBox) => Promise<void>;
      }
    ).afterCreate(rawBox);
    expect(
      await DB.RoleUserBoxBottoms.count({
        where: { boxBottomId: rawBox.boxBottomId },
      }),
    ).toBe(1);
  });

  it('validates transaction rules with real records before persistence', async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const category = await createCategory(user.userId);
    const service = new TransactionService();
    const transaction = {
      boxBottomId: box.boxBottomId,
      categoryId: category.categoryId,
      movementType: 'inflow',
      value: 0,
      transactionDate: new Date().toISOString(),
      description: 'Valor inválido',
    };

    await expect(service.create(transaction)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(
      service.create({ ...transaction, value: 5, movementType: 'transfer' }),
    ).rejects.toMatchObject({ statusCode: 400 });
    await expect(
      service.create({ ...transaction, value: 5, boxBottomId: INVALID_UUID }),
    ).rejects.toMatchObject({ statusCode: 404 });
    await expect(
      service.create({ ...transaction, value: 5, categoryId: INVALID_UUID }),
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(await DB.Transactions.count()).toBe(0);
  });

  it('lists a user transactions through the real service query', async () => {
    const user = await createUser();
    const anotherUser = await createUser();
    const ownedBox = await createBox(user.userId);
    const unrelatedBox = await createBox(anotherUser.userId);
    const category = await createCategory(user.userId);
    await createCategory(anotherUser.userId);
    await createTransaction(ownedBox.boxBottomId, category.categoryId);
    await createTransaction(unrelatedBox.boxBottomId, category.categoryId);

    const result = await new TransactionService().getAllTransactionsByUser(
      user.userId,
    );
    expect(result).toHaveLength(1);
    expect(result[0].targetBox?.name).toBe(ownedBox.name);
  });

  it('covers base service persistence, transaction, read, and no-op branches', async () => {
    class UserModelService extends Service<UserModel, User> {
      constructor() {
        super(DB.Users, 'userId');
      }
    }

    const service = new UserModelService();
    const first = await service.create({
      name: 'Base A',
      email: 'base-a@example.com',
      password: 'plain',
    });
    const transaction = await DB.sequelize.transaction();
    const second = await service.create(
      {
        name: 'Base B',
        email: 'base-b@example.com',
        password: 'plain',
      },
      { transaction },
    );
    await transaction.commit();

    expect(await service.getAll()).toHaveLength(2);
    expect(await service.getById(first.userId)).toMatchObject({
      email: first.email,
    });
    expect(await service.update(INVALID_UUID, { name: 'Absent' })).toBe(false);
    expect(await service.delete(INVALID_UUID)).toBe(false);
    expect(await service.delete(second.userId)).toBe(true);
    await expect(service.getById(INVALID_UUID)).rejects.toMatchObject({
      statusCode: 404,
    });
    await expect(
      service.create({ name: null, email: null, password: null }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects unavailable entities and duplicate user-box roles with the real database', async () => {
    const user = await createUser();
    const box = await createBox(user.userId);
    const role = await createRole('OWNER');
    const service = new RoleUserBoxBottomService();

    await expect(
      service.create({
        userId: INVALID_UUID,
        boxBottomId: box.boxBottomId,
        roleId: role!.roleId,
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
    await expect(
      service.create({
        userId: user.userId,
        boxBottomId: INVALID_UUID,
        roleId: role!.roleId,
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
    await expect(
      service.create({
        userId: user.userId,
        boxBottomId: box.boxBottomId,
        roleId: INVALID_UUID,
      }),
    ).rejects.toMatchObject({ statusCode: 404 });

    await assignRole(user.userId, box.boxBottomId, role!.roleId);
    await expect(
      service.create({
        userId: user.userId,
        boxBottomId: box.boxBottomId,
        roleId: role!.roleId,
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});
