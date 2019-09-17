const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = 'production';
const srcFolder = './src/';
const distFolder = '../dist/';

const SASSPaths = JSON.parse(fs.readFileSync('./webpack/srcfiles.json'))['styles'];

let exp = [];

// SASS
for (let pathElt of SASSPaths) {
  const srcpth = pathElt.srcpath;
  const pth = pathElt.path;
  const name = pathElt.name;
  const settings = {
    mode: mode,
    entry: srcFolder + srcpth + name + '.scss',
    output: {
      filename: '_placeholder.js',
      path: path.resolve(__dirname, distFolder + pth),
    },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: 'css-loader', options: {url: false}},
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer(),
                cssNano({
                  preset: 'default',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules'],
            },
          },
        ],
      }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: name + '.[contenthash].css',
        chunkFilename: '[id].css',
      }),
    ],
  };

  exp.push(settings);
}

module.exports = exp;
