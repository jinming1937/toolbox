module.exports = {
  root: true,
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  extends: [
    'plugin:prettier/recommended',
    'eslint-config-alloy',
    'eslint-config-alloy/react',
    'eslint-config-alloy/typescript',
  ],
  env: {
    es6: true,
    'amd': true,
    'commonjs': true,
  },
  plugins: ['prettier'],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    // React: false,
    // ReactDOM: false

    // 用于 jest-puppeteer
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
  },
  rules: {
    "prettier/prettier": "error",
    // @fixable 一个缩进必须用两个空格替代
    // indent: [
    //   'error',
    //   2,
    //   {
    //     SwitchCase: 1,
    //     flatTernaryExpressions: true,
    //   },
    // ],
    // @fixable jsx 的 children 缩进必须为两个空格
    // 'react/jsx-indent': ['error', 2],
    // @fixable jsx 的 props 缩进必须为两个空格
    'react/jsx-indent-props': ['error', 2],
    'no-undefined': 0,
    // eslint还不支持 class-fields特性
    // https://github.com/typescript-eslint/typescript-eslint/issues/491
    // https://github.com/eslint/eslint/issues/7565
    'no-invalid-this': 0,
    // 不限制类成员顺序
    '@typescript-eslint/member-ordering': 'off',
    // 不限制对象可访问性
    '@typescript-eslint/explicit-member-accessibility': 'off',
    // 不限制空interface
    '@typescript-eslint/no-empty-interface': 'off',
    // 允许const类型断言
    '@typescript-eslint/consistent-type-assertions': [
      'warn',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow',
      },
    ],
    // 允许require存在
    '@typescript-eslint/no-var-requires': 'off',

    'react/jsx-curly-brace-presence': 'off',
  },
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '16.13',
    },
  },
};
