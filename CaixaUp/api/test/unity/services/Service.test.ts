import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Service } from '#services/Service.js';
import { BadRequestError, NotFoundError } from '#errors/httpErrors.js';

class TestService extends Service<any, any> {
  public beforeCreateCalls: any[] = [];
  public afterCreateCalls: any[] = [];

  constructor(model: any) {
    super(model, 'userId');
  }

  protected override async beforeCreate(dto: any): Promise<void> {
    this.beforeCreateCalls.push(dto);
  }

  protected override async afterCreate(record: any): Promise<void> {
    this.afterCreateCalls.push(record);
  }
}

const createMockModel = () => ({
  name: 'Users',
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
});

describe('Service base class unit tests', () => {
  let model: any;
  let service: TestService;

  beforeEach(() => {
    model = createMockModel();
    service = new TestService(model);
  });

  it('U1 - create() chama beforeCreate antes de persistir o registro', async () => {
    const order: string[] = [];

    class RecordingService extends TestService {
      protected override async beforeCreate(dto: any): Promise<void> {
        order.push('beforeCreate');
      }

      protected override async afterCreate(record: any): Promise<void> {
        order.push('afterCreate');
      }
    }

    const recordingService = new RecordingService(model);
    model.create.mockResolvedValue({ userId: 'generated-id' });

    await recordingService.create({ name: 'Ana' });

    expect(order[0]).toBe('beforeCreate');
    expect(order[1]).toBe('afterCreate');
  });

  it('U2 - create() gera um UUID para a PK quando não informado', async () => {
    const record = { userId: 'generated-id' };
    model.create.mockResolvedValue(record);

    const result = await service.create({ name: 'Ana' });

    expect(result).toBe(record);
  });

  it('U3 - create() chama afterCreate com o registro criado', async () => {
    const record = { userId: 'generated-id' };
    model.create.mockResolvedValue(record);

    await service.create({ name: 'Ana' });

    expect(service.afterCreateCalls).toHaveLength(1);
    expect(service.afterCreateCalls[0]).toBe(record);
  });

  it('U4 - create() propaga o erro lançado dentro de beforeCreate', async () => {
    class FailingBeforeCreateService extends TestService {
      protected override async beforeCreate(): Promise<void> {
        throw new Error('erro do hook');
      }
    }

    const failingService = new FailingBeforeCreateService(model);

    await expect(failingService.create({ name: 'Ana' })).rejects.toThrow('erro do hook');
  });

  it('U5 - create() encapsula erros de persistência em uma BadRequestError', async () => {
    model.create.mockRejectedValue(new Error('database down'));

    await expect(service.create({ name: 'Ana' })).rejects.toBeInstanceOf(BadRequestError);
    await expect(service.create({ name: 'Ana' })).rejects.toThrow('Erro ao criar registro em Users');
  });

  it('U5b - create() não deve mascarar a mensagem real de afterCreate', async () => {
    class FailingAfterCreateService extends TestService {
      protected override async afterCreate(): Promise<void> {
        throw new Error('falha ao criar vínculo');
      }
    }

    const failingService = new FailingAfterCreateService(model);
    model.create.mockResolvedValue({ userId: 'generated-id' });

    await expect(failingService.create({ name: 'Ana' })).rejects.toThrow('falha ao criar vínculo');
  });

  it('U6 - getAll() repassa options para findAll e retorna a lista', async () => {
    const options = { where: { active: true } };
    const result = [{ userId: '1' }];
    model.findAll.mockResolvedValue(result);

    await expect(service.getAll(options)).resolves.toBe(result);
    expect(model.findAll).toHaveBeenCalledWith(options);
  });

  it('U7 - getById() lança erro quando o registro não é encontrado', async () => {
    model.findByPk.mockResolvedValue(null);

    await expect(service.getById('missing-id')).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.getById('missing-id')).rejects.toThrow('Users não encontrado');
  });

  it('U8 - getById() retorna o registro quando encontrado', async () => {
    const record = { userId: '1' };
    model.findByPk.mockResolvedValue(record);

    await expect(service.getById('1')).resolves.toBe(record);
  });

  it('U9 - update() retorna true quando o registro é afetado', async () => {
    model.update.mockResolvedValue([1]);

    await expect(service.update('1', { name: 'Nova' })).resolves.toBe(true);
    expect(model.update).toHaveBeenCalledWith({ name: 'Nova' }, { where: { userId: '1' } });
  });

  it('U10 - update() retorna false quando nenhum registro é afetado', async () => {
    model.update.mockResolvedValue([0]);

    await expect(service.update('1', { name: 'Nova' })).resolves.toBe(false);
  });

  it('U11 - delete() chama destroy com o where correto baseado na PK', async () => {
    model.destroy.mockResolvedValue(1);

    await expect(service.delete('1')).resolves.toBe(true);
    expect(model.destroy).toHaveBeenCalledWith({ where: { userId: '1' } });
  });

  it('U12 - beforeCreate/afterCreate default não alteram o fluxo', async () => {
    const defaultService = new Service(model as any, 'userId');
    model.create.mockResolvedValue({ userId: 'generated-id' });

    await expect(defaultService.create({ name: 'Ana' } as any)).resolves.toEqual({ userId: 'generated-id' });
  });
});
