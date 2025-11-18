const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.RoleUserBoxBottom, {
        foreignKey: 'role_id',
        as: 'role_user_box_bottoms',
      });
    }
  }
  Role.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'role',
  });
  return Role;
};
