/*
 * @Author: HxB
 * @Date: 2023-04-27 14:18:11
 * @LastEditors: DoubleAm
 * @LastEditTime: 2024-05-13 12:32:55
 * @Description: eslint 配置文件
 * @FilePath: \web_mods_base\.eslintrc.js
 */

const { eslintRules } = require('js-xxx');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier', 'react', '@typescript-eslint', 'spellcheck', 'import', 'zob'],
  rules: eslintRules(['webview'], { 'react/no-unknown-property': 'warn' }),
  settings: {
    react: {
      version: 'detect',
    },
  },
};
