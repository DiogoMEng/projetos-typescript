'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('permissions', 'role_user_box_bottom_id', 'permission_id')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('permissions', 'permission_id', 'role_user_box_bottom_id')
  }
};
