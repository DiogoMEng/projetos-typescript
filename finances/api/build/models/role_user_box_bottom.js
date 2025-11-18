const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoleUserBoxBottom extends Model {
    static associate(models) {
      RoleUserBoxBottom.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
      RoleUserBoxBottom.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      RoleUserBoxBottom.belongsTo(models.BoxBottom, {
        foreignKey: 'box_bottom_id',
        as: 'box_bottom',
      });
    }
  }
  RoleUserBoxBottom.init({
    box_bottom_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'role_user_box_bottom',
  });
  return RoleUserBoxBottom;
};
