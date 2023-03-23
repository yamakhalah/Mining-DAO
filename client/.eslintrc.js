module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/prop-types': ['off'],
    'multiline-ternary': ['off'],
    '@typescript-eslint/strict-boolean-expressions': "warn",
    '@typescript-eslint/consistent-type-imports': "warn"
  }
}
