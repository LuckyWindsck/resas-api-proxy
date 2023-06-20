import path from 'path'
import { fileURLToPath } from 'url'
import globals from 'globals'
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import airbnbBaseConfig from 'eslint-config-airbnb-base'
import _ from 'lodash'
import eslintImport from 'eslint-plugin-import'
import airbnbTypescriptComfig from 'eslint-config-airbnb-typescript'

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
  rules: {
    ...js.configs.recommended.rules,
    ...airbnbBase.rules,
    // Allow __filename & __dirname to use underscore in variable name
    'no-underscore-dangle': (() => {
      const rule = airbnbBase.rules['no-underscore-dangle']
      rule[1] = { allow: ['__filename', '__dirname'] }
      return rule
    })(),
    // Allow importing devDependencies in eslint.config.mjs
    'import/no-extraneous-dependencies': (() => {
      const rule = airbnbBase.rules['import/no-extraneous-dependencies']
      rule[1].devDependencies.push('eslint.config.mjs')
      return rule
    })(),
  },
  settings: airbnbBase.settings,
}

const tsFileConfig = {
  files: ['*.config.ts', 'src/**/*.ts'],
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
