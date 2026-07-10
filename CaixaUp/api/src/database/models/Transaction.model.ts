import { Transaction } from '../../interfaces/transaction.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type TrasactionCreationAttributes = Optional<
  Transaction,
  'boxBottomId'
>

export class TransactionModel extends Model< Transaction, TrasactionCreationAttributes > implements Transaction {
  declare trasactionId: string;
  declare boxBottomId: string;
  declare categoryId: string;
  declare movementType: string;
  declare value: number;
  declare transactionDate: string;
  declare description: string;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    TransactionModel.belongsTo(models.BoxBottoms, {
      foreignKey: 'boxBottomId',
      as: 'targetBox',
    });

    TransactionModel.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      as: 'transactionCategory',
    });
  }
};
export default function (sequelize: Sequelize): typeof TransactionModel {
  TransactionModel.init({
    transactionId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      field: 'transaction_id',
    },
    boxBottomId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      field: 'box_bottom_id',
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      field: 'category_id',
    },
    movementType: {
      allowNull: false,
      type: DataTypes.ENUM('inflow', 'outflow'),
      field: 'movement_type',
    },
    value: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      field: 'value',
    },
    transactionDate: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'transaction_date',
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'description',
    },
  }, {
    tableName: 'transactions',
    sequelize,
    timestamps: true,
  });

  return TransactionModel;
}