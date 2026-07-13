import { RUBB } from '#interfaces/roleUserBoxBottom.interface.js';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type RUBBCreationAttributes = Optional<
  RUBB,
  'boxBottomId' | 'userId' | 'roleId'
>

export class RUBBModel extends Model< RUBB, RUBBCreationAttributes > implements RUBB {
  declare roleUserBoxBottomId: string;
  declare boxBottomId: string;
  declare userId: string;
  declare roleId: string;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    RUBBModel.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'assignedUser',
    });

    RUBBModel.belongsTo(models.BoxBottoms, {
      foreignKey: 'boxBottomId',
      as: 'assignedBox',
    });

    RUBBModel.belongsTo(models.Roles, {
      foreignKey: 'roleId',
      as: 'assignedRole',
    });
  }
}

export default function (sequelize: Sequelize): typeof RUBBModel {
  RUBBModel.init({
    roleUserBoxBottomId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      field: 'role_user_box_bottom_id',
    },
    boxBottomId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      field: 'box_bottom_id',
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      field: 'user_id',
    },
    roleId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      field: 'role_id',
    },
  }, {
    tableName: 'role_user_box_bottoms',
    sequelize,
    timestamps: true,
    underscored: true,
  });

  return RUBBModel;
}