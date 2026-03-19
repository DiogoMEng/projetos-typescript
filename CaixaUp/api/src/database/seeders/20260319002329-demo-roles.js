const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_id: uuidv4(),
        name: 'OWNER',
        description: 'Poder absoluto. Criador da caixinha, gere membros, permissões e pode eliminar a caixinha.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: uuidv4(),
        name: 'MANAGER',
        description: 'Administrador. Pode gerir membros e transações, mas não pode eliminar a caixinha.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: uuidv4(),
        name: 'EDITOR',
        description: 'Colaborador padrão. Pode criar, editar e eliminar qualquer transação.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: uuidv4(),
        name: 'CONTRIBUTOR',
        description: 'Colaborador restrito. Pode apenas adicionar novas transações (não pode editar as existentes).',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: uuidv4(),
        name: 'ANALYST',
        description: 'Visualizador avançado. Acesso a relatórios e gráficos, mas sem permissão de escrita.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: uuidv4(),
        name: 'VIEWER',
        description: 'Observador básico. Pode apenas ver o saldo atual e a lista de transações.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
