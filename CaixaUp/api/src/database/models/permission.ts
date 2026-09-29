import { Permission } from '#interfaces/permission.interface.js';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type PermissionCreationAttributes = Optional<
  Permission,
  'boxBottomId' | 'userId' | 'roleId'
>

export class PermissionModel extends Model< Permission, PermissionCreationAttributes > implements Permission {
  declare PermissionId: string;
  declare boxBottomId: string;
  declare userId: string;
  declare roleId: string;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    PermissionModel.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'assignedUser',
    });

    PermissionModel.belongsTo(models.BoxBottoms, {
      foreignKey: 'boxBottomId',
      as: 'assignedBox',
    });

    PermissionModel.belongsTo(models.Roles, {
      foreignKey: 'roleId',
      as: 'assignedRole',
    });
  }
}

export default function (sequelize: Sequelize): typeof PermissionModel {
  PermissionModel.init({
    PermissionId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      field: 'permission_id',
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
    tableName: 'Permissions',
    sequelize,
    timestamps: true,
    underscored: true,
  });

  return PermissionModel;
}