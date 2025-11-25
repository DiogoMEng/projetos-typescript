/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Renomeia a coluna 'nome' para 'name' na tabela 'categories'
    await queryInterface.renameColumn('categories', 'nome', 'name');
  },

  async down(queryInterface, Sequelize) {
    // Reverte a alteração, renomeando 'name' de volta para 'nome'
    await queryInterface.renameColumn('categories', 'name', 'nome');
  },
};
