/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('transactions', 'createdAt', 'created_at');
    await queryInterface.renameColumn('transactions', 'updatedAt', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('transactions', 'created_at', 'createdAt');
    await queryInterface.renameColumn('transactions', 'updated_at', 'updatedAt');
  },
};
