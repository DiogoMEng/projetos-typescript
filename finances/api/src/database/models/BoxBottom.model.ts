import { BoxBottom } from '../../interfaces/boxBottom.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type BoxBottomCreationAttributes = Optional<
  BoxBottom,
  'boxBottomId'
>

export class BoxBottomModel extends Model< BoxBottom, BoxBottomCreationAttributes > implements BoxBottom {
  public boxBottomId!: string;
  public userId!: string;
  public name!: string;
  public description!: string;
  public targetValue!: number;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    BoxBottomModel.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'BoxCreator',
    });

    BoxBottomModel.hasMany(models.Transactions, {
      foreignKey: 'boxBottomId',
      as: 'boxTransactions',
    });

    BoxBottomModel.hasMany(models.RoleUserBoxBottoms, {
      foreignKey: 'boxBottomId',
      as: 'boxMembers',
    })
  }
}

export default function (sequelize: Sequelize): typeof BoxBottomModel {
  BoxBottomModel.init({
    boxBottomId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      field: 'box_bottom_id',
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'user_id',
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'name',
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'description',
    },
    targetValue: {
      allowNull: false,
      type: DataTypes.NUMBER,
      field: 'target_value',
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'box_bottoms',
    sequelize,
    timestamps: true,
  });

  return BoxBottomModel;
}