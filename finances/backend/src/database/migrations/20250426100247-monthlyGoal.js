'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("monthly_goal", {
      monthly_goal_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true      
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      limit_value: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.000
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("monthly_goal")
  }
};
