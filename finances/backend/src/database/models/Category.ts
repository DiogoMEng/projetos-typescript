import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";

class Category extends Model {
  declare categoryId: number
  declare name: string
  declare description: string
}

Category.init({
  categoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: "No notes"
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "user",
      key: "userId"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  }
}, {
  sequelize: db,
  tableName: "category",
  modelName: "Category",
  underscored: true,
  timestamps: false
});

Category.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "user"
});

User.hasMany(Category, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "categories"
});

export default Category;