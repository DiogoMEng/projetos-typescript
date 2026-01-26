/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('roles', 'createdAt', 'created_at');
    await queryInterface.renameColumn('roles', 'updatedAt', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('roles', 'created_at', 'createdAt');
    await queryInterface.renameColumn('roles', 'updated_at', 'updatedAt');
  },
};
