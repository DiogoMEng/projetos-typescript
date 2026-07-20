import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
  tsconfig: 'tsconfig.test.json',
});

export default {
  ...presetConfig,
  testEnvironment: 'node',
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
  },
  testTimeout: 30000,
} satisfies Config;