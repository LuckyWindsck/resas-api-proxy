/* eslint-disable no-param-reassign */
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import airbnbBaseConfig from 'eslint-config-airbnb-base'
import airbnbTypescriptComfig from 'eslint-config-airbnb-typescript'
import prettierConfig from 'eslint-config-prettier'
import eslintImport from 'eslint-plugin-import'
import globals from 'globals'
import _ from 'lodash'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const airbnbBase = (await Promise.all(airbnbBaseConfig.extends.map((rule) => import(rule))))
  .map((ruleModule) => ruleModule.default)
  .reduce(_.merge)
const airbnbTypesciptBase = (await import(airbnbTypescriptComfig.extends)).default

// Config for diffrent type of files

const jsFileConfig = {
  files: ['eslint.config.mjs'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.es2021,
      ...globals.node,
    },
  },
  plugins: {
    import: eslintImport,
  },
  rules: (() => {
    const rules = {
      ...js.configs.recommended.rules,
      ...airbnbBase.rules,
    }

    rules['no-underscore-dangle'][1].allow = ['__filename', '__dirname']

    // Allow importing devDependencies in *.config.ts
    rules['import/no-extraneous-dependencies'][1].devDependencies.push('eslint.config.mjs')

    return rules
  })(),
  settings: airbnbBase.settings,
}

const tsFileConfig = {
  files: ['*.config.ts', 'api/**/*.ts'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: typescriptParser,
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
    globals: {
      ...globals.es2021,
      ...globals.node,
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  plugins: {
    import: eslintImport,
    '@typescript-eslint': typescript,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...airbnbBase.rules,
    ...typescript.configs['eslint-recommended'].overrides[0].rules,
    ...typescript.configs.recommended.rules,
    ...typescript.configs['recommended-requiring-type-checking'].rules,
    // Fix: https://github.com/iamturns/eslint-config-airbnb-typescript/issues/320
    ..._.cloneDeep(airbnbTypesciptBase.rules),
    ...airbnbTypesciptBase.overrides.rules,
  },
  settings: {
    ...airbnbBase.settings,
    ...airbnbTypesciptBase.settings,
  },
}

export default [jsFileConfig, tsFileConfig, prettierConfig]
