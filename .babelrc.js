module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    '@babel/react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    ['import', {libraryName: 'antd', style: true}],
  ]
};
