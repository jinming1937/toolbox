// plugins - 指定引入的插件列表。插件会扩展项目的配置、命令等，可以帮助快速搭建特定的开发环境。
// config - 项目的配置对象，通过它可以操作资源入口和 webpack 配置。
// hooks - 打包过程中的钩子。
// commands - 自定义命令，如构建、测试脚本等。

module.exports = {
  plugins: [],
  config: {
    exports: [
      // './style/base',
      // css
      // './css/base.css',
      './css/decode.css',
      './css/differ.css',
      './css/toolStyle.css',


      './js/decode.js',
      './js/differ.js',
      './js/fastParse.js',
      './js/toolScript.js',
    ],
    modifyWebpackConfig: function (config) {
      // edit ykit's Webpack configs
      console.log(this.env); // local

      return config;
    }
  },
  hooks: {},
  commands: []
};
