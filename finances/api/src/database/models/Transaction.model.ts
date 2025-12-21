import { Trasaction } from '../../interfaces/transaction.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type TrasactionCreationAttributes = Optional<
  Trasaction,
  'boxBottomId'
>

export class TrasactionModel extends Model< Trasaction, TrasactionCreationAttributes > implements Trasaction {
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
}
''
export default function (sequelize: Sequelize): typeof TrasactionModel {
  TrasactionModel.init({
    trasactionId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      field: 'trasaction_id',
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'users',
    sequelize,
    timestamps: true,
  });

  return TrasactionModel;
}