import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  // ================================
  // 🚫 IGNORE FILES
  // ================================
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/logs/**',
      '**/*.js', 
      'package-lock.json',
    ],
  },

  // ================================
  // 📦 BASE CONFIGS
  // ================================
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // ================================
  // 🎯 TYPESCRIPT CONFIG
  // ================================
  {
    files: ['**/*.ts'],

    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },

    // ================================
    // 📏 RULES
    // ================================
    rules: {
      // ================================
      // 🚫 LOGGING RULES (STRICT)
      // ================================
      'no-console': 'warn',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console']",
          message:
            '❌ DO NOT USE console. Use the shared logger instead.',
        },
      ],

      // ================================
      // 🧠 TYPESCRIPT SAFETY
      // ================================
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      // 🔴 CRITICAL BUG PREVENTION
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // ================================
      // ⚖️ PRACTICAL FLEXIBILITY
      // ================================
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',

      // ================================
      // 🧹 CODE STYLE
      // ================================
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],

      // ================================
      // ⚙️ NODE / ENV
      // ================================
      'no-process-env': 'off',
    },
  }
);