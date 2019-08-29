const path = require('path');
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = 'production';
const srcPath = './WebInterface/src/';
const distPath = './WebInterface/dist/';

const JSPaths = [
//  {path: 'js/', name: 'index'},
//  {path: 'js/', name: 'about'},
//  {path: 'js/', name: 'play'},
];
const HTMLPaths = [
  {path: 'html/', name: 'index'},
  {path: 'html/about/', name: 'index'},
  {path: 'html/play/', name: 'index'},
];
const SASSPaths = [
  {path: 'styles/', name: 'index'},
  {path: 'styles/', name: 'about'},
  {path: 'styles/', name: 'play'},
];

let exp = [];

// JS
for (let pathElt of JSPaths) {
  const pth = pathElt.path;
  const name = pathElt.name;
  const settings = {
    mode: mode,
    entry: srcPath + pth + name + '.js',
    output: {
      filename: name + '.js',
      path: path.resolve(__dirname, distPath + pth),
    },
  };

  exp.push(settings);
}

// HTML
for (let pathElt of HTMLPaths) {
  const pth = pathElt.path;
  const name = pathElt.name;
  const settings = {
    mode: mode,
    entry: srcPath + pth + name + '.html',
    output: {
      filename: '_placeholder.js',
      path: path.resolve(__dirname, distPath + pth),
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
  const pth = pathElt.path;
  const name = pathElt.name;
  const settings = {
    mode: mode,
    entry: srcPath + pth + name + '.scss',
    output: {
      filename: '_placeholder.js',
      path: path.resolve(__dirname, distPath + pth),
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
