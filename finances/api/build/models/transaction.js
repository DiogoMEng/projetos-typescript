'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    box_bottom_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    movement_type: DataTypes.ENUM('inflow', 'outflow'),
    value: DataTypes.DECIMAL,
    transaction_date: DataTypes.DATE,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};