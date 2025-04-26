import { DataTypes, Model } from "sequelize";
import db from ".";

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
  }
  
}, {
  sequelize: db,
  tableName: "payment_method",
  modelName: "PaymentMethod",
  underscored: true,
  timestamps: false
});

export default PaymentMethod;