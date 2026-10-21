import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', '.cache/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.tsx'],
    plugins: { 'react-hooks': hooks, 'react-refresh': refresh },
    rules: {
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['react', 'react-dom', 'react-router', '*firebase*', '**/app/**', '**/modules/**', '**/ui/**', '**/data/**', '**/application/**'] }],
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'sessionStorage', 'indexedDB', 'fetch'],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error',
        { selector: 'CallExpression[callee.name="eval"]', message: 'Nessuna esecuzione dinamica.' },
        { selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]', message: 'Usare componenti, non incorporare HTML legacy.' },
      ],
    },
  },
);
