/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transactions', [
      {
        transaction_id: 'e2a4a340-0870-4a87-8495-2c8c464e8b3c',
        value: 1500.00,
        description: 'Depósito inicial para reserva',
        movement_type: 'inflow',
        transaction_date: new Date('2026-02-01T10:00:00Z'),
        box_bottom_id: '4d1e2e98-1372-4d2c-9034-783267598c1a', // Reserva Emergência (Ana)
        category_id: '38910403-1092-4919-8664-9669527e025a', // Salário
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: 'f3b5b451-1981-5b98-9506-3d9d575f9c4d',
        value: 120.50,
        description: 'Supermercado Mensal',
        movement_type: 'outflow',
        transaction_date: new Date('2026-02-05T15:30:00Z'),
        box_bottom_id: '4d1e2e98-1372-4d2c-9034-783267598c1a', // Reserva Emergência (Ana)
        category_id: '1224d06a-a169-4e56-9a25-9c5950a323a6', // Alimentação
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '04c6c562-2a92-6ca9-a617-4eae686a0d5e',
        value: 3000.00,
        description: 'Projeto Freelance Mobile',
        movement_type: 'inflow',
        transaction_date: new Date('2026-02-02T09:00:00Z'),
        box_bottom_id: '5f2a1b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c', // Viagem Japão (Bruno)
        category_id: '62035978-654a-47d0-9944-934d40212f8a', // Freelance
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '15d7d673-3b03-7db0-b728-5fbf797b1e6f',
        value: 250.00,
        description: 'Ingressos Show de Rock',
        movement_type: 'outflow',
        transaction_date: new Date('2026-02-08T20:00:00Z'),
        box_bottom_id: 'a1b2c3d4-e5f6-4789-90ab-cdef12345678', // Novo MacBook (Carla)
        category_id: '82798e40-025c-4860-8409-a7281f66191c', // Lazer
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '26e8e784-4c14-8ec1-c839-60c0808c2f70',
        value: 80.00,
        description: 'Medicamentos Farmácia',
        movement_type: 'outflow',
        transaction_date: new Date('2026-02-04T11:20:00Z'),
        box_bottom_id: 'b2c3d4e5-f6a7-4890-b1cd-ef2345678901', // Manutenção Carro (Diego)
        category_id: 'e68595a4-569b-4375-9e66-419830573e6d', // Saúde
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '37f9f895-5d25-9fd2-d94a-71d1919d3081',
        value: 500.00,
        description: 'Curso de movement_typeScript Avançado',
        movement_type: 'outflow',
        transaction_date: new Date('2026-01-20T14:00:00Z'),
        box_bottom_id: 'f6a7b8c9-d0e1-4234-f5af-678901234567', // Cursos Tech (Hugo)
        category_id: 'd9b6264d-3b7d-4bad-9bdd-2b0d7b3dcb6d', // Educação
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '48a0a906-6e36-00e3-ea5b-82e2a2ae4192',
        value: 1200.00,
        description: 'Aporte Mensal Ações',
        movement_type: 'inflow',
        transaction_date: new Date('2026-02-10T08:30:00Z'),
        box_bottom_id: 'c3d4e5f6-a7b8-4901-c2de-f34567890123', // Aposentadoria (Elena)
        category_id: '7a9e6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', // Investimento
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '59b1ba17-7f47-11f4-fb6c-93f3b3bf5203',
        value: 1500.00,
        description: 'Pagamento Aluguel',
        movement_type: 'outflow',
        transaction_date: new Date('2026-02-05T09:00:00Z'),
        box_bottom_id: 'e5f6a7b8-c9d0-4123-e4fe-567890123456', // Casamento (Gabi)
        category_id: '1c7ac10b-58cc-4372-a567-0e02b2c3d479', // Moradia
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '6ac2cb28-8058-2205-0c7d-a404c4c06314',
        value: 45.90,
        description: 'Uber para Evento',
        movement_type: 'outflow',
        transaction_date: new Date('2026-02-09T18:45:00Z'),
        box_bottom_id: 'f6a7b8c9-d0e1-4234-f5af-678901234567', // Cursos Tech (Hugo)
        category_id: '5f7ac10b-58cc-4372-a567-0e02b2c3d480', // Transporte
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: '7bd3dc39-9169-3316-1d8e-b515d5d17425',
        value: 200.00,
        description: 'Presente de Aniversário Mãe',
        movement_type: 'outflow',
        transaction_date: new Date('2026-02-10T12:00:00Z'),
        box_bottom_id: '0a1b2c3d-4e5f-4345-a6bf-789012345678', // Fundo Natal (Isis)
        category_id: '9d7ac10b-58cc-4372-a567-0e02b2c3d481', // Presentes
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  },
};
