import { BoxBottom } from '../../interfaces/boxBottom.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type BoxBottomCreationAttributes = Optional<
  BoxBottom,
  'boxBottomId'
>

export class BoxBottomModel extends Model< BoxBottom, BoxBottomCreationAttributes > implements BoxBottom {
  declare boxBottomId: string;
  declare userId: string;
  declare name: string;
  declare description: string;
  declare targetValue: number;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

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
    });
  }
}

export default function (sequelize: Sequelize): typeof BoxBottomModel {
  BoxBottomModel.init({
    boxBottomId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
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
  }, {
    tableName: 'box_bottoms',
    sequelize,
    timestamps: true,
  });

  return BoxBottomModel;
}