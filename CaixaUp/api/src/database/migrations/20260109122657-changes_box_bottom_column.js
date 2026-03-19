/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('box_bottoms', 'createdAt', 'created_at');
    await queryInterface.renameColumn('box_bottoms', 'updatedAt', 'updated_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('box_bottoms', 'created_at', 'createdAt');
    await queryInterface.renameColumn('box_bottoms', 'updated_at', 'updatedAt');
  },
};
