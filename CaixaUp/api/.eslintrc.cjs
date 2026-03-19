module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 0,
    'prefer-destructuring': 0,
    'no-underscore-dangle': 0,
    'import/no-extraneous-dependencies': 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'no-shadow': 0,
    'array-callback-return': 0,
    'no-unused-vars': 0,
  },
  overrides: [
    {
      files: [
        '*.test.js',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
