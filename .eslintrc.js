module.exports = {
    env: {
      commonjs: true,
      es2021: true,
      node: true,
    },
    rules: {
      'no-console': 'off',
      'class-methods-use-this': 'off',
      camelcase: 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    },
  };