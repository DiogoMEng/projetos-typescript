import { DB } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../interfaces/transaction.interface';

class TransactionService {
  async register(dto: Transaction): Promise<Transaction> {
    const boxExists = await DB.BoxBottoms.findByPk(dto.boxBottomId);
    if (!boxExists) {
      throw new Error('BoxBottom not found.');
    }
    const categoryExists = await DB.Categories.findByPk(dto.categoryId);
    if (!categoryExists) {
      throw new Error('Category not found.');
    }
    if (dto.value <= 0) {
      throw new Error('Transaction value must be greater than zero.');
    }
    try {
      const newTransaction = await DB.Transactions.create({
        transactionId: uuidv4(),
        boxBottomId: dto.boxBottomId,
        categoryId: dto.categoryId,
        movementType: dto.movementType,
        value: dto.value,
        transactionDate: dto.transactionDate,
        description: dto.description,
      });
      return newTransaction;
    } catch (error) {
      throw new Error('Error registering transaction.');
    }
  }

  async getAllTransactions(id: string): Promise<Transaction[]> {
    const transactions = await DB.Transactions.findAll({
    include: [
      {
        model: DB.BoxBottoms,
        as: 'targetBox',
        where: { userId: id },
        attributes: ['name']
      },
      {
        model: DB.Categories,
        as: 'transactionCategory',
        attributes: ['name', 'type']
      }
    ],
    order: [['transactionDate', 'DESC']],
    limit: 50,
    attributes: {
      exclude: ['boxBottomId', 'categoryId']
    }
  });
    return transactions;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const transaction = await DB.Transactions.findByPk(id, {
      attributes: {
        exclude: ['boxBottomId', 'categoryId']
      }
    });
    if(!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async editTransaction(id: string, dto: Partial<Transaction>): Promise<boolean | void> {
    const listUpdateData = await DB.Transactions.update(dto, {
      where: { transactionId: id },
    });
    if (listUpdateData[0] === 0) {
      return false;
    }
    return true;
  }

  async deleteTransaction(id: string): Promise<void> {
    await DB.Transactions.destroy({
      where: { transactionId: id },
    });
  }
}

export default TransactionService;
