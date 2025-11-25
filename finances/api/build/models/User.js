const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Category, {
        foreignKey: 'user_id',
        as: 'categories',
      });
      User.hasMany(models.RoleUserBoxBottom, {
        foreignKey: 'user_id',
        as: 'owned_boxes',
      });
      User.hasMany(models.BoxBottom, {
        foreignKey: 'user_id',
        as: 'boxAssignments',
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};
