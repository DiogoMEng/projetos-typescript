'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('role_user_box_bottoms', 'permissions')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('permissions', 'role_user_box_bottoms')
  }
};
