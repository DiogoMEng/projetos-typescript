/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('role_user_box_bottoms', 'createdAt', 'created_at');
    await queryInterface.renameColumn('role_user_box_bottoms', 'updatedAt', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('role_user_box_bottoms', 'created_at', 'createdAt');
    await queryInterface.renameColumn('role_user_box_bottoms', 'updated_at', 'updatedAt');
  },
};
