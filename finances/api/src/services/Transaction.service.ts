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

  // async getAllBoxBottomsByUser(id: string): Promise<BoxBottom[]> {
  //   const boxBottoms = await DB.BoxBottoms.findAll({
  //     where: {
  //       userId: id
  //     },
  //     attributes: {
  //       exclude: ['userId']
  //     }
  //   });
  //   return boxBottoms;
  // }

  // async getBoxBottomById(id: string): Promise<BoxBottom | null> {
  //   const boxBottom = await DB.BoxBottoms.findByPk(id, {
  //     attributes: {
  //       exclude: ['userId']
  //     }
  //   });
  //   if(!boxBottom) {
  //     throw new Error('BoxBottom not found');
  //   }
  //   return boxBottom;
  // }

  // async editBoxBottom(id: string, dto: Partial<BoxBottom>): Promise<boolean | void> {
  //   const listUpdateData = await DB.BoxBottoms.update(dto, {
  //     where: { boxBottomId: id },
  //   });
  //   if (listUpdateData[0] === 0) {
  //     return false;
  //   }
  //   return true;
  // }

  // async deleteBoxBottom(id: string): Promise<void> {
  //   await DB.BoxBottoms.destroy({
  //     where: { boxBottomId: id },
  //   });
  // }
}

export default TransactionService;
