import { Category } from '#interfaces/category.interface.js';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type CategoryCreationAttributes = Optional<
  Category,
  'categoryId'
>

export class CategoryModel extends Model< Category, CategoryCreationAttributes > implements Category {
  declare categoryId: string;
  declare userId: string;
  declare name: string;
  declare type: string;
  declare created_at: string | undefined;
  declare updated_at: string | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    CategoryModel.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'categoryOwner',
    });

    CategoryModel.hasMany(models.Transactions, {
      foreignKey: 'categoryId',
      as: 'categoryTransactions',
    });
  }
}

export default function (sequelize: Sequelize): typeof CategoryModel {
  CategoryModel.init({
    categoryId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      field: 'category_id',
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
      field: 'user_id',
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'name',
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('receita', 'despesa'),
    },
  }, {
    tableName: 'categories',
    sequelize,
    timestamps: true,
    underscored: true,
  });

  return CategoryModel;
}