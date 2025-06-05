import { DataTypes, Model } from "sequelize";
import db from ".";

class User extends Model {
  declare userId: number
  declare fullName: string
  declare email: string
  declare password: string
}

User.init({
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: "user",
  modelName: "User",
  underscored: true,
  createdAt: true,
  updatedAt: false
});

export default User;