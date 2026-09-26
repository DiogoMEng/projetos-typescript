const { execFileSync } = require('node:child_process');
const { resolve } = require('node:path');

module.exports = async function runDatabaseMigrationsOnce() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Integração exige NODE_ENV=test');
  }

  const apiDirectory = resolve(__dirname, '../..');
  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  execFileSync(npxCommand, ['sequelize-cli', 'db:migrate'], {
    cwd: apiDirectory,
    env: process.env,
    stdio: 'inherit',
  });
};
