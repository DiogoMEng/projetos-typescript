import { Role } from '#interfaces/role.interface.js';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type RoleCreationAttributes = Optional<
  Role,
  'roleId'
>

export class RoleModel extends Model< Role, RoleCreationAttributes > implements Role {
  declare roleId: string;
  declare name: string;
  declare description: string;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    RoleModel.hasMany(models.RoleUserBoxBottoms, {
      foreignKey: 'roleId',
      as: 'roleAssignments',
    });
  }
}

export default function (sequelize: Sequelize): typeof RoleModel {
  RoleModel.init({
    roleId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      field: 'role_id',
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'name',
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      field: 'description',
    },
  }, {
    tableName: 'roles',
    sequelize,
    timestamps: true,
  });

  return RoleModel;
}