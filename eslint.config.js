import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
    // Base JavaScript config
    js.configs.recommended,

    // Vue configs
    ...pluginVue.configs['flat/essential'],

    // Global settings
    {
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                fetch: 'readonly'
            }
        }
    },

    // JavaScript/Vue files
    {
        files: ['**/*.{js,mjs,cjs,vue}'],
        rules: {
            // Vue-specific rules
            'vue/multi-word-component-names': 'off',
            'vue/component-definition-name-casing': ['error', 'PascalCase'],
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/html-self-closing': ['error', {
                html: {
                    void: 'always',
                    normal: 'always',
                    component: 'always'
                }
            }],
            'vue/max-attributes-per-line': ['error', {
                singleline: 1,
                multiline: 1
            }],
            'vue/first-attribute-linebreak': ['error', {
                singleline: 'beside',
                multiline: 'below'
            }],
            'vue/html-closing-bracket-newline': ['error', {
                singleline: 'never',
                multiline: 'always'
            }],
            'vue/html-closing-bracket-spacing': ['error', {
                startTag: 'never',
                endTag: 'never',
                selfClosingTag: 'always'
            }],
            'vue/singleline-html-element-content-newline': ['error', {
                ignoreWhenNoAttributes: true,
                ignoreWhenEmpty: true
            }],
            'vue/multiline-html-element-content-newline': ['error', {
                ignoreWhenEmpty: true,
                allowEmptyLines: false
            }],
            'vue/html-indent': ['error', 4],

            // General JavaScript rules for formatting
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'never'],
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-function-paren': ['error', 'always'],
            'keyword-spacing': ['error', { before: true, after: true }],
            'space-infix-ops': 'error',
            'eol-last': ['error', 'always'],
            'no-trailing-spaces': 'error',
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
            'comma-spacing': ['error', { before: false, after: true }],
            'key-spacing': ['error', { beforeColon: false, afterColon: true }],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }]
        }
    },

    // TypeScript files (if you add TypeScript support later)
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
        }
    },

    // Vue files with TypeScript
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: ['.vue']
            }
        }
    },

    // Ignore patterns
    {
        ignores: [
            'dist/',
            'node_modules/',
            '.git/',
            '*.min.js',
            'public/'
        ]
    }
]
