const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const mode = 'production';
const srcFolder = './src/';
const distFolder = '../dist/';

const JSPaths = JSON.parse(fs.readFileSync('./webpack/srcfiles.json'))['scripts'];

let exp = [];

// JS
for (let pathElt of JSPaths) {
  const srcpth = pathElt.srcpath;
  const pth = pathElt.path;
  const name = pathElt.name;

  const settings = {
    mode: mode,
    devtool: 'source-map',
    entry: srcFolder + srcpth + name + '.js',
    output: {
      filename: name + '.[contenthash].js',
      path: path.resolve(__dirname, distFolder + pth),
    },
    plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              'API_URL': JSON.stringify('https://games.kobert.dev/api/lobby/'),
              'API_LOGIN': JSON.stringify('https://games.kobert.dev/api/lobby/groups/'),
          }
      }),
    ],
  };

  exp.push(settings);
}

module.exports = exp;
