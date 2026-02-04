/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('roles', 'roles_id', 'role_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('roles', 'role_id', 'roles_id');
  },
};
