import { Transaction } from '../../interfaces/transaction.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type TrasactionCreationAttributes = Optional<
  Transaction,
  'boxBottomId'
>

export class TransactionModel extends Model< Transaction, TrasactionCreationAttributes > implements Transaction {
  public trasactionId!: string;
  public boxBottomId!: string;
  public categoryId!: string;
  public movementType!: string;
  public value!: number;
  public transactionDate!: string;
  public description!: string;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
}
''
export default function (sequelize: Sequelize): typeof TransactionModel {
  TransactionModel.init({
    transactionId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      field: 'transaction_id',
    },
    boxBottomId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'box_bottom_id',
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.UUID,
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