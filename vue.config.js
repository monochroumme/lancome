const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

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
            name: 'widget',
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
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
      }
    }
  },
  css: {
    extract: false
  },
  chainWebpack: config => {
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.output = {
        ...args[0].terserOptions.output,
        comments: false  // exclude all comments from output
      }
      return args
    })
    // https://medium.com/@aetherus.zhou/vue-cli-3-performance-optimization-55316dcd491c
    config.optimization.delete('splitChunks') // no vendor chunks
    config.plugins.delete('prefetch')         // no prefetch chunks
    config.plugins.delete('preload')  
    config.plugin('CompressionPlugin').use(CompressionPlugin);
  }
}
