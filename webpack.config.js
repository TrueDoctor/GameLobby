const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = 'production';
const srcFolder = './WebInterface/src/';
const distFolder = './WebInterface/dist/';

const JSPaths = [
  {srcpath: 'js/', path: 'js/', name: 'index'},
//  {srcpath: 'js/', path: 'js/', name: 'about'},
//  {srcpath: 'js/', path: 'js/', name: 'play'},
];
const HTMLPaths = [
  {srcpath: 'html/', path: '', name: 'index'},
  {srcpath: 'html/about/', path: 'about/', name: 'index'},
  {srcpath: 'html/play/', path: 'play/', name: 'index'},
];
const SASSPaths = [
  {srcpath: 'styles/', path: 'styles/', name: 'index'},
  {srcpath: 'styles/', path: 'styles/', name: 'about'},
  {srcpath: 'styles/', path: 'styles/', name: 'play'},
];

let exp = [];

// JS
for (let pathElt of JSPaths) {
  const srcpth = pathElt.srcpath;
  const pth = pathElt.path;
  const name = pathElt.name;
  const settings = {
    mode: mode,
    entry: srcFolder + srcpth + name + '.js',
    output: {
      filename: name + '.js',
      path: path.resolve(__dirname, distFolder + pth),
    },
    plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              'API_URL': JSON.stringify('https://games.kobert.dev/api/lobby'),
          }
      }),
    ],
  };

  exp.push(settings);
}

// HTML
for (let pathElt of HTMLPaths) {
  const srcpth = pathElt.srcpath;
  const pth = pathElt.path;
  const name = pathElt.name;
  const settings = {
    mode: mode,
    entry: srcFolder + srcpth + name + '.html',
    output: {
      filename: '_placeholder.js',
      path: path.resolve(__dirname, distFolder + pth),
    },
    module: {
      rules: [{
        test: /\.html$/,
        loaders: [
          'file-loader?name=' + name + '.html',
          'extract-loader',
          {loader: 'html-loader', options: {attrs: false}},
        ],
      }],
    },
    plugins: [
      new HtmlMinifierPlugin({
        collapseWhitespace: true,
        removeEmptyAttributes: true,
      }),
    ],
  };

  exp.push(settings);
}

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
        filename: name + '.css',
        chunkFilename: '[id].css',
      }),
    ],
  };

  exp.push(settings);
}

module.exports = exp;
