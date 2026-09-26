import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
  tsconfig: 'tsconfig.test.json',
});

const isIntegration = process.env.CAIXAUP_INTEGRATION === 'true';
const integrationCoverageThreshold: Config['coverageThreshold'] = {
  global: {
    statements: 98,
    branches: 90,
    functions: 98,
    lines: 98,
  },
};
const integrationReporters: Config['reporters'] = [
  'default',
  [
    'jest-html-reporters',
    {
      publicPath: 'coverage/integration/results',
      filename: 'index.html',
      pageTitle: 'CaixaUp Integration Test Results',
      expand: true,
      includeFailureMsg: true,
    },
  ],
];
const integrationConfig: Partial<Config> = {};

if (isIntegration) {
  integrationConfig.globalSetup = '<rootDir>/test/integration/globalSetup.cjs';
  integrationConfig.maxWorkers = 1;
  integrationConfig.collectCoverage = true;
  integrationConfig.setupFilesAfterEnv = [
    '<rootDir>/test/integration/setup.ts',
  ];
  integrationConfig.coverageThreshold = integrationCoverageThreshold;
  integrationConfig.reporters = integrationReporters;
}

export default {
  ...presetConfig,
  ...integrationConfig,
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/@types/**',
    '!src/interfaces/**',
    '!src/server.ts',
    '!src/database/migrations/**',
    '!src/database/seeders/**',
    '!src/config/sequelize_cli.js',
  ],
  coverageDirectory: '<rootDir>/coverage/integration',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
  ],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
  ],
  moduleNameMapper: {
    '^#models/(.*)\\.js$': '<rootDir>/src/database/models/$1.ts',
    '^#services/(.*)\\.js$': '<rootDir>/src/services/$1.ts',
    '^#controllers/(.*)\\.js$': '<rootDir>/src/controllers/$1.ts',
    '^#routes/(.*)\\.js$': '<rootDir>/src/routes/$1.ts',
    '^#middlewares/(.*)\\.js$': '<rootDir>/src/middlewares/$1.ts',
    '^#utils/(.*)\\.js$': '<rootDir>/src/utils/$1.ts',
    '^#config/(.*)\\.js$': '<rootDir>/src/config/$1.ts',
    '^#interfaces/(.*)\\.js$': '<rootDir>/src/interfaces/$1.ts',
    '^#errors/(.*)\\.js$': '<rootDir>/src/errors/$1.ts',
    '^#validations/(.*)\\.js$': '<rootDir>/src/validations/$1.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testTimeout: 30000,
} satisfies Config;
