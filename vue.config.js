const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          // Custom common chunk
          bundle: {
            name: 'app',
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Customer vendor
          vendors: {
            chunks: 'initial',
            name: 'vendors',
            test: 'vendors',
          },
          // Merge all the CSS into one file
          styles: {
            name: 'styles',
            test: /\.s?css$/,
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          }
        }),
      ],
    }
  },
  css: {
    extract: false
  }
}
