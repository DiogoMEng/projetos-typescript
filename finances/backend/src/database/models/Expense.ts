import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";
import Category from "./Category";
import PaymentMethod from "./PaymentMethod";

class Expense extends Model {
  declare expenseId: number
  declare description: string
  declare value: number
  declare date: Date
  declare observation: string
  declare situation: boolean
  declare userId: number
  declare categoryId: number
  declare paymentMethodId: number
}

Expense.init({
        expenseId: {
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
        date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        observation: {
          type: DataTypes.STRING,
          defaultValue: "No observation"
        },
        situation: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
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
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "category",
            key: "categoryId"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        paymentMethodId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "paymentMethod",
            key: "paymentMethodId"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        }
}, {
  sequelize: db,
  tableName: "expense",
  modelName: "Expense",
  underscored: true,
  timestamps: false
})

Expense.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "user"
});

User.hasMany(Expense, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "expenses"
});

Expense.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "category"
});

Category.hasMany(Expense, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "expenses"
});

Expense.belongsTo(PaymentMethod, {
  foreignKey: "paymentMethodId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "paymentMethod"
});

PaymentMethod.hasMany(Expense, {
  foreignKey: "paymentMethodId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "expenses"
});

export default Expense;