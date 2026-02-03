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

  static associate(models: any) {
    CategoryModel.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'categoryOwner',
    });

    CategoryModel.hasMany(models.Transactions, {
      foreignKey: 'categoryId',
      as: 'categoryTransactions',
    })
  }
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
  }, {
    tableName: 'categories',
    sequelize,
    timestamps: true,
    underscored: true,
  });

  return CategoryModel;
}