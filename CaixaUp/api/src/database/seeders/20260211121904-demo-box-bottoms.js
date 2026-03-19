/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('box_bottoms', [
      {
        box_bottom_id: '4d1e2e98-1372-4d2c-9034-783267598c1a',
        name: 'Reserva de Emergência',
        description: 'Fundo para imprevistos e segurança financeira mensal.',
        target_value: 12000.00,
        user_id: '657e3371-d8a4-4903-9f20-4f5a34237e6d', // Ana Silva
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: '5f2a1b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
        name: 'Viagem Japão',
        description: 'Economia para passagens, hospedagem e sushis em Tokyo.',
        target_value: 25000.00,
        user_id: 'b8c4c340-0870-4a87-8495-2c8c464e8b3b', // Bruno Oliveira
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: 'a1b2c3d4-e5f6-4789-90ab-cdef12345678',
        name: 'Novo MacBook',
        description: 'Upgrade de equipamento para desenvolvimento e estudos.',
        target_value: 15000.00,
        user_id: '7b545d1d-9e61-460d-965a-006282998a6c', // Carla Souza
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: 'b2c3d4e5-f6a7-4890-b1cd-ef2345678901',
        name: 'Manutenção Carro',
        description: 'Pneus, troca de óleo e revisões periódicas do possante.',
        target_value: 3000.00,
        user_id: '50e68e4b-0177-4404-9844-332e650d306b', // Diego Santos
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: 'c3d4e5f6-a7b8-4901-c2de-f34567890123',
        name: 'Aposentadoria',
        description: 'Fundo de longo prazo para uma velhice tranquila e com pé na areia.',
        target_value: 500000.00,
        user_id: 'df369795-3062-4b2a-8742-1e967a5b3584', // Elena Martins
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: 'd4e5f6a7-b8c9-4012-d3ef-456789012345',
        name: 'Reforma do Quarto',
        description: 'Pintura, novos móveis e aquela cadeira gamer que falta.',
        target_value: 8000.00,
        user_id: '99846399-5285-4841-8f5b-513693e54728', // Fabio Lima
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: 'e5f6a7b8-c9d0-4123-e4fe-567890123456',
        name: 'Casamento',
        description: 'Festa, buffet e a sonhada lua de mel.',
        target_value: 40000.00,
        user_id: '01861036-745a-4933-9111-5d070180492c', // Gabi Costa
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: 'f6a7b8c9-d0e1-4234-f5af-678901234567',
        name: 'Cursos Tech',
        description: 'Investimento em certificações e cursos de especialização.',
        target_value: 2000.00,
        user_id: 'e63297a7-193f-4e08-9993-4a62176461c3', // Hugo Rocha
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: '0a1b2c3d-4e5f-4345-a6bf-789012345678',
        name: 'Fundo de Natal',
        description: 'Presentes para a família e a ceia de final de ano.',
        target_value: 1500.00,
        user_id: '202c892b-867c-4074-9540-10905161405e', // Isis Novaes
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        box_bottom_id: '1b2c3d4e-5f6a-4456-b7cf-890123456789',
        name: 'IPVA 2027',
        description: 'Provisionamento para os impostos do início do próximo ano.',
        target_value: 3500.00,
        user_id: '64f7c244-640c-443b-82d2-811c759556d1', // João Vitor
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('box_bottoms', null, {});
  },
};
