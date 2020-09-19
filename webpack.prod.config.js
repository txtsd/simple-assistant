const CopyPlugin = require('copy-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const VERSION = require('./package.json').version;
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/assets/rewrite.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "index.js"
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/,
        use: [
          CssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ],
      }
    ]
  },
  plugins: [
    new CssExtractPlugin({
      filename: 'styles.css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/static',
          globOptions: {
            ignore: ['**/dev/**'],
          },
          transform(content, path) {
            if (path.indexOf('manifest') !== -1) {
              let manifest = JSON.parse(content.toString());
                  manifest.version = VERSION;
                  manifest.version_name = VERSION;
              return Buffer.from(JSON.stringify(manifest));
            }
            return content;
          },
        }
      ],
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.vue'],
  },
};