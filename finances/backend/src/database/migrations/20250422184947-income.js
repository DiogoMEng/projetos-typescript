'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("income", {
      income_id: {
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
      date_receipt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
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
    await queryInterface.dropTable("income")
  }
};
