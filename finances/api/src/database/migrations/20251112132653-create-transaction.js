/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      transaction_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
      },
      box_bottom_id: {
        type: Sequelize.UUID,
        references: {
          model: 'box_bottoms',
          key: 'box_bottom_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      category_id: {
        type: Sequelize.UUID,
        references: {
          model: 'categories',
          key: 'category_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      movement_type: {
        type: Sequelize.ENUM('inflow', 'outflow'),
      },
      value: {
        type: Sequelize.DECIMAL,
      },
      transaction_date: {
        type: Sequelize.DATE,
      },
      description: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  },
};
