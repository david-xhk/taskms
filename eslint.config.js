const js = require("@eslint/js")
const jsdoc = require("eslint-plugin-jsdoc")
const globals = require("globals")
const compat = new (require("@eslint/eslintrc").FlatCompat)()

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      jsdoc
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn"
    }
  },
  {
    files: ["packages/tms-app/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    ...compat.plugins("react", "react-hooks")[0],
    rules: {
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
]
