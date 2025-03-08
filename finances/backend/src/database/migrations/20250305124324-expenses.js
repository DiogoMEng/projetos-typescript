'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("expense", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      expense_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: "Sem descrição no momento"
      },
      expense_amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("expense")
  }
};
