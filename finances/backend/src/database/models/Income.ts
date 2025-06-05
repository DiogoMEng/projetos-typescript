import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";

class Income extends Model {
  declare incomeId: number
  declare description: string
  declare value: number
  declare dateReceipt: Date
  declare type: string
  declare userId: number
}

Income.init({
  incomeId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: "No notes"
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  dateReceipt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: "income",
  modelName: "Income",
  underscored: true,
  timestamps: false
})

Income.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "user"
});

User.hasMany(Income, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "income"
})

export default Income;