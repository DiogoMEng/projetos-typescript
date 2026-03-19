/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        user_id: '657e3371-d8a4-4903-9f20-4f5a34237e6d',
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 'b8c4c340-0870-4a87-8495-2c8c464e8b3b',
        name: 'Bruno Oliveira',
        email: 'bruno.o@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '7b545d1d-9e61-460d-965a-006282998a6c',
        name: 'Carla Souza',
        email: 'carla.souza@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '50e68e4b-0177-4404-9844-332e650d306b',
        name: 'Diego Santos',
        email: 'diego.s@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 'df369795-3062-4b2a-8742-1e967a5b3584',
        name: 'Elena Martins',
        email: 'elena.m@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '99846399-5285-4841-8f5b-513693e54728',
        name: 'Fabio Lima',
        email: 'fabio.lima@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '01861036-745a-4933-9111-5d070180492c',
        name: 'Gabi Costa',
        email: 'gabi.c@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 'e63297a7-193f-4e08-9993-4a62176461c3',
        name: 'Hugo Rocha',
        email: 'hugo.rocha@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '202c892b-867c-4074-9540-10905161405e',
        name: 'Isis Novaes',
        email: 'isis.n@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: '64f7c244-640c-443b-82d2-811c759556d1',
        name: 'João Vitor',
        email: 'joao.v@email.com',
        password: 'hash_password_123',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
