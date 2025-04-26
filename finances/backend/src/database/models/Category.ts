import { DataTypes, Model } from "sequelize";
import db from ".";

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
  }
}, {
  sequelize: db,
  tableName: "category",
  modelName: "Category",
  underscored: true,
  timestamps: false
});

export default Category;