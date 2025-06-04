import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";

class PaymentMethod extends Model {
  declare paymentMethodId: number
  declare type: string
  declare description: string
}

PaymentMethod.init({
  paymentMethodId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type: {
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
  tableName: "payment_method",
  modelName: "PaymentMethod",
  underscored: true,
  timestamps: false
});

PaymentMethod.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "user"
});

User.hasMany(PaymentMethod, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "paymentMethods"
});

export default PaymentMethod;