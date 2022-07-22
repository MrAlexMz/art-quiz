const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    clean: true,
    assetModuleFilename: 'assets/[hash][ext]'
  },
  devServer: {
    static: './dist',
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'ArtQuiz',
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src/assets'),
        to: 'assets'
      }]
    })
  ],

  module: {
    rules: [
      {
        test: /\.[png|jpg|svg|jpeg|gif]$/,
        use: ['file-loader']
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  }

}
