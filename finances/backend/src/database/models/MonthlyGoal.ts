import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";

class MonthlyGoal extends Model { 
  declare monthlyGoalId: number
  declare month: number
  declare year: number
  declare limitValue: number
  declare userId: number
}

MonthlyGoal.init({
      monthlyGoalId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true      
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      limitValue: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.000
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
  tableName: "monthly_goal",
  modelName: "MonthlyGoal",
  underscored: true,
  timestamps: false
});

MonthlyGoal.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "user"
});

User.hasMany(MonthlyGoal, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "monthlyGoal"
})