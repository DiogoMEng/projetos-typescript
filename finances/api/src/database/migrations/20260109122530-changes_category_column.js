/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('categories', 'createdAt', 'created_at');
    await queryInterface.renameColumn('categories', 'updatedAt', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('categories', 'created_at', 'createdAt');
    await queryInterface.renameColumn('categories', 'updated_at', 'updatedAt');
  },
};
