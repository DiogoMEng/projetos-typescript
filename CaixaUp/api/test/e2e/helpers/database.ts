import { afterAll, beforeAll, beforeEach } from '@jest/globals';
import { DB } from '#models/index.js';

export function useE2eDatabase(): void {
  beforeAll(async () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('E2E exige NODE_ENV=test');
    }
    await DB.sequelize.authenticate();
  });
  beforeEach(resetE2eDatabase);
  afterAll(async () => DB.sequelize.close());
}

async function resetE2eDatabase(): Promise<void> {
  await DB.sequelize.query(
    'TRUNCATE TABLE permissions, transactions, box_bottoms, categories, users, roles CASCADE',
  );
  await DB.Roles.bulkCreate([
    { name: 'OWNER', description: 'Owner role' },
    { name: 'MANAGER', description: 'Manager role' },
    { name: 'EDITOR', description: 'Editor role' },
    { name: 'CONTRIBUTOR', description: 'Contributor role' },
    { name: 'ANALYST', description: 'Analyst role' },
    { name: 'VIEWER', description: 'Viewer role' },
  ]);
}
