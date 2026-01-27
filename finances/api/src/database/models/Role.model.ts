import { Role } from '../../interfaces/role.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type RoleCreationAttributes = Optional<
  Role,
  'rolesId'
>

export class RoleModel extends Model< Role, RoleCreationAttributes > implements Role {
  public rolesId!: string;
  public name!: string;
  public description!: string;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    RoleModel.hasMany(models.RoleUserBoxBottoms, {
      foreignKey: 'roleId',
      as: 'roleAssignments',
    })
  }
}

export default function (sequelize: Sequelize): typeof RoleModel {
  RoleModel.init({
    rolesId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      field: 'roles_id',
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'roles',
    sequelize,
    timestamps: true,
  });

  return RoleModel
}