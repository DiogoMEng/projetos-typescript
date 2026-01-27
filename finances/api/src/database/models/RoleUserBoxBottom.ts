import { RUBB } from '../../interfaces/roleUserBoxBottom.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type RUBBCreationAttributes = Optional<
  RUBB,
  'boxBottomId' | 'userId' | 'roleId'
>

export class RUBBModel extends Model< RUBB, RUBBCreationAttributes > implements RUBB {
  public roleUserBoxBottomId!: number;
  public boxBottomId!: number;
  public userId!: number;
  public roleId!: number;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
    })
  }
}

export default function (sequelize: Sequelize): typeof RUBBModel {
  RUBBModel.init({
    roleUserBoxBottomId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      field: 'role_user_box_bottom_id',
    },
    boxBottomId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'box_bottom_id',
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'user_id',
    },
    roleId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: 'role_id',
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'users',
    sequelize,
    timestamps: true,
  });

  return RUBBModel
}