const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Category, {
        foreignKey: 'user_id',
        as: 'user_categories',
      });
      User.hasMany(models.RoleUserBoxBottom, {
        foreignKey: 'user_id',
        as: 'user_role_box_bottoms',
      });
      User.hasMany(models.BoxBottom, {
        foreignKey: 'user_id',
        as: 'user_box_bottoms',
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};
