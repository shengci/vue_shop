module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren':0,
    'quote-props':0,
    'vue/no-unused-vars':0
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
