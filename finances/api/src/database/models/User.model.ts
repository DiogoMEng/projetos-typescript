import { User } from '../../interfaces/user.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';


export type UserCreationAttributes = Optional<
  User,
  'userId'
>

export class UserModel extends Model< User, UserCreationAttributes > implements User {
  public userId!: string;
  public email!: string;
  public name!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    UserModel.hasMany(models.CategoryModel, {
      foreignKey: 'userId',
      as: 'userCategories',
    });

    UserModel.hasMany(models.BoxBottomModel, {
      foreignKey: 'userId',
      as: 'userOwnedBoxex',
    })

    UserModel.hasMany(models.UBBModel, {
      foreignKey: 'userId',
      as: ' userPermissions',
    })
  }
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init({
    userId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
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

  return UserModel
}