const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator',
      });
      Category.hasMany(models.Transaction, {
        foreignKey: 'category_id',
        as: 'transactions',
      });
    }
  }
  Category.init({
    category_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_user_category',
    },
    type: {
      type: DataTypes.ENUM('receita', 'despesa'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'nome'],
      },
    ],
  });
  return Category;
};
