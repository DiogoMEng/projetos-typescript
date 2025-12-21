import { Category } from '../../interfaces/category.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type CategoryCreationAttributes = Optional<
  Category,
  'categoryId'
>

export class CategoryModel extends Model< Category, CategoryCreationAttributes > implements Category {
  public categoryId!: string;
  public userId!: string;
  public name!: string;
  public type!: string;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CategoryModel {
  CategoryModel.init({
    categoryId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      field: 'category_id',
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
    type: {
      allowNull: false,
      type: DataTypes.ENUM('receita', 'despesa'),
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'categories',
    sequelize,
    timestamps: true,
  });

  return CategoryModel;
}