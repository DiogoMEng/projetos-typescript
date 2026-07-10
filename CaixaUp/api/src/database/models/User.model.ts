import { RUBBModel } from '../models/RoleUserBoxBottom';
import { User } from '../../interfaces/user.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type UserCreationAttributes = Optional<
  User,
  'userId'
>

export class UserModel extends Model< User, UserCreationAttributes > implements User {
  declare userId: string;
  declare email: string;
  declare name: string;
  declare password: string;

  declare userPermissions?: RUBBModel[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    UserModel.hasMany(models.Categories, {
      foreignKey: 'userId',
      as: 'userCategories',
    });

    UserModel.hasMany(models.BoxBottoms, {
      foreignKey: 'userId',
      as: 'userOwnedBoxex',
    });

    UserModel.hasMany(models.RoleUserBoxBottoms, {
      foreignKey: 'userId',
      as: 'userPermissions',
    });
  }
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init({
    userId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      field: 'user_id',
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'name',
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      field: 'email',
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING(255),
      field: 'password',
    },
  }, {
    tableName: 'users',
    sequelize,
    timestamps: true,
    underscored: true,
  });

  return UserModel;
}