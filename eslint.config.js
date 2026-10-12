import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [{ ignores: ['dist', '*.d.ts', '*.js'] }, { files: ['**/*.{ts,tsx}'], languageOptions: { parser: tseslint.parser, parserOptions: { ecmaVersion: 2022, sourceType: 'module' }, globals: globals.browser }, plugins: { '@typescript-eslint': tseslint.plugin, 'react-hooks': reactHooks, 'react-refresh': reactRefresh }, rules: { ...js.configs.recommended.rules, ...reactHooks.configs.recommended.rules, ...reactRefresh.configs.vite.rules, '@typescript-eslint/no-unused-vars': 'off', 'no-unused-vars': 'off' } }]
