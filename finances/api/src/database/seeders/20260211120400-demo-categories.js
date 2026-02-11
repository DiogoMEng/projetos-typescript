/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        category_id: '38910403-1092-4919-8664-9669527e025a',
        name: 'Salário',
        type: 'receita',
        user_id: '657e3371-d8a4-4903-9f20-4f5a34237e6d', // Ana Silva
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '62035978-654a-47d0-9944-934d40212f8a',
        name: 'Freelance',
        type: 'receita',
        user_id: 'b8c4c340-0870-4a87-8495-2c8c464e8b3b', // Bruno Oliveira
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '1224d06a-a169-4e56-9a25-9c5950a323a6',
        name: 'Alimentação',
        type: 'despesa',
        user_id: '657e3371-d8a4-4903-9f20-4f5a34237e6d', // Ana Silva
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '82798e40-025c-4860-8409-a7281f66191c',
        name: 'Lazer',
        type: 'despesa',
        user_id: '7b545d1d-9e61-460d-965a-006282998a6c', // Carla Souza
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'e68595a4-569b-4375-9e66-419830573e6d',
        name: 'Saúde',
        type: 'despesa',
        user_id: '50e68e4b-0177-4404-9844-332e650d306b', // Diego Santos
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'd9b6264d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        name: 'Educação',
        type: 'despesa',
        user_id: 'df369795-3062-4b2a-8742-1e967a5b3584', // Elena Martins
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '7a9e6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        name: 'Investimento',
        type: 'receita',
        user_id: '99846399-5285-4841-8f5b-513693e54728', // Fabio Lima
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '1c7ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'Moradia',
        type: 'despesa',
        user_id: '01861036-745a-4933-9111-5d070180492c', // Gabi Costa
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '5f7ac10b-58cc-4372-a567-0e02b2c3d480',
        name: 'Transporte',
        type: 'despesa',
        user_id: 'e63297a7-193f-4e08-9993-4a62176461c3', // Hugo Rocha
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: '9d7ac10b-58cc-4372-a567-0e02b2c3d481',
        name: 'Presentes',
        type: 'despesa',
        user_id: '202c892b-867c-4074-9540-10905161405e', // Isis Novaes
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
