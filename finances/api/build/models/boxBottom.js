const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BoxBottom extends Model {
    static associate(models) {
      BoxBottom.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator',
      });
      BoxBottom.hasMany(models.Transaction, {
        foreignKey: 'box_bottom_id',
        as: 'transactions',
      });
      BoxBottom.hasMany(models.RoleUserBoxBottom, {
        foreignKey: 'box_bottom_id',
        as: 'user_roles',
      });
    }
  }
  BoxBottom.init({
    box_bottom_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    target_value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
  }, {
    sequelize,
    modelName: 'BoxBottom',
    tableName: 'box_bottoms',
  });
  return BoxBottom;
};
