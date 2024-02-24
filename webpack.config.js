const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, '/lib/main.js'),
  output: {
    filename: 'msfg.umd.js',
    path: path.join(__dirname, '/dist'),
    library: {
      name: 'MSFG',
      type: 'umd',
      export: 'default',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  externals: {
    vue: 'Vue', // 防止将 Vue 打包进输出文件
  },
}