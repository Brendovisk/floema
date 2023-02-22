module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    indent: 0
  }
}
