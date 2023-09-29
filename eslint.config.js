import js from "@eslint/js"
import jsdoc from "eslint-plugin-jsdoc"
import react from "eslint-plugin-react"
import globals from "globals"

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
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
    plugins: {
      react: {
        rules: react.rules
      }
    },
    rules: {
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn"
    }
  }
]
