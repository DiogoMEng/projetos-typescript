const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoleUserBoxBottom extends Model {
    static associate(models) {
      RoleUserBoxBottom.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'assigned_role',
      });
      RoleUserBoxBottom.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'member',
      });
      RoleUserBoxBottom.belongsTo(models.BoxBottom, {
        foreignKey: 'box_bottom_id',
        as: 'fund',
      });
    }
  }
  RoleUserBoxBottom.init({
    role_user_box_bottom_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    box_bottom_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    role_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'RoleUserBoxBottom',
    tableName: 'role_user_box_bottoms',
  });
  return RoleUserBoxBottom;
};
