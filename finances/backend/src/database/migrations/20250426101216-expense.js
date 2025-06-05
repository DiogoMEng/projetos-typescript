'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("expense", {
      expense_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: "No notes"
      },
      value: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      observation: {
        type: DataTypes.STRING,
        defaultValue: "No observation"
      },
      situation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "category",
          key: "category_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "payment_method",
          key: "payment_method_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("expense")
  }
};