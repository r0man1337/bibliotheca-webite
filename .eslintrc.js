module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: [],
  // add your custom rules here
  rules: {},
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      env: {
        jest: true,
      },
      globals: {
        React: 'writable',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
      },
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
      rules: {
        // temp allowing during TS migration
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
            minimumDescriptionLength: 4,
          },
        ],
      },
    },
  ],
}
