const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'category_user',
      });
      Category.hasMany(models.Transaction, {
        foreignKey: 'category_id',
        as: 'category_transactions',
      });
    }
  }
  Category.init({
    category_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    user_id: DataTypes.INTEGER,
    nome: DataTypes.STRING,
    type: DataTypes.ENUM('receita', 'despesa'),
  }, {
    sequelize,
    modelName: 'category',
  });
  return Category;
};
