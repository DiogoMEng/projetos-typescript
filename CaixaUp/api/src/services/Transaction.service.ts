import { DB } from '../database/models';
import { Transaction } from '../interfaces/transaction.interface';
import { Service } from './Service';

class TransactionService extends Service<any, Transaction> {
  constructor() {
    super(DB.Transactions, 'transactionId')
  }

  async getAllTransactionsByUser(userId: string) {
    return await super.getAll({
      include: [
        {
          model: DB.BoxBottoms,
          as: 'targetBox',
          where: { userId: userId },
          attributes: [ 'name' ]
        },
        {
          model: DB.Categories,
          as: 'transactionCategory',
          attributes: [ 'name', 'type' ]
        }
      ],
      order: [['transactionDate', 'DESC']],
      limit: 50,
      attributes: {
        exclude: ['boxBottomId', 'categoryId']
      }
    })
  }

  protected async beforeCreate(dto: Transaction): Promise<void> {
    if (dto.value <= 0) throw new Error('Valor deve ser maior que zero.');

    const [box, cat] = await Promise.all([
      DB.BoxBottoms.findByPk(dto.boxBottomId),
      DB.Categories.findByPk(dto.categoryId)
    ]);

    if (!box || !cat ) throw new Error('Caixinha ou Categoria não encontrada.');
  }

  protected async afterCreate(record: any): Promise<void> {
    console.log(`Log: Transação ${record.transactionId} criada com sucesso.`);
  }
}

export default TransactionService;
