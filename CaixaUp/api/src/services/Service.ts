import { v4 as uuidv4 } from 'uuid';
import { Model, ModelStatic } from 'sequelize';

export abstract class Service<T extends Model, DTO> {
  protected model: ModelStatic<T>;
  protected primaryKey: string;

  constructor(model: ModelStatic<T>, primaryKey: string) {
    this.model = model;
    this.primaryKey = primaryKey;
  }

  async create(dto: DTO): Promise<T> {
    await this.beforeCreate(dto);
    const data = {
      ...dto as any,
      [this.primaryKey]: uuidv4(),
    };
    try {
      const record = await this.model.create(data);
      await this.afterCreate(record);
      return record;
    } catch (error) {
      throw new Error(`Erro ao criar registro em ${this.model.name}`);
    }
  }

  async getAll(options: object = {}): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async getById(id: string, options: object = {}): Promise<T> {
    const record = await this.model.findByPk(id, options);
    if(!record) throw new Error(`${this.model.name} não encontrado`);
    return record;
  }

  async update(id: string, dto: Partial<DTO>): Promise<boolean> {
    const [affectedCount] = await this.model.update(dto as any, {
      where: { [this.primaryKey]: id } as any
    });
    return affectedCount > 0;
  }

  async delete(id: string): Promise<void> {
    await this.model.destroy({
      where: { [this.primaryKey]: id } as any
    });
  }

  protected async beforeCreate(dto: DTO): Promise<void> { }
  protected async afterCreate(record: T): Promise<void> { }
}