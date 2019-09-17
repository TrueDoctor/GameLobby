const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');

const mode = 'production';
const srcFolder = './src/';
const distFolder = '../dist/';

let exp = [];

// Map src names onto dist names containing their hash
const SASSPaths = JSON.parse(fs.readFileSync('./webpack/srcfiles.json'))['styles'];
const JSPaths = JSON.parse(fs.readFileSync('./webpack/srcfiles.json'))['scripts'];
const HTMLPaths = JSON.parse(fs.readFileSync('./webpack/srcfiles.json'))['html'];

const styleOutput = JSON.parse(fs.readFileSync('./webpack/styles-output.json'));
const scriptOutput = JSON.parse(fs.readFileSync('./webpack/scripts-output.json'));
const resourcesOutput = JSON.parse(fs.readFileSync('./webpack/resources-output.json')).replace;

const styleMappings = [];
const scriptMappings = [];

for (let i = 0; i < SASSPaths.length; i++) {
  styleMappings.push({'old': SASSPaths[i].name + '.css', 'new': styleOutput.children[i].assets[1].name});
}

for (let i = 0; i < JSPaths.length; i++) {
  scriptMappings.push({'old': JSPaths[i].name + '.js', 'new': scriptOutput.children[i].assets[0].name});
}

const replace = [];
for (let elt of styleMappings) {
  replace.push({'search': elt.old, 'replace': elt.new});
}
for (let elt of scriptMappings) {
  replace.push({'search': elt.old, 'replace': elt.new});
}
for (let elt of resourcesOutput) {
  replace.push(elt);
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
          {loader: 'string-replace-loader', options: {multiple: replace}},
        ],
      }],
    },
    plugins: [
      new HtmlMinifierPlugin({
        collapseWhitespace: true,
        removeEmptyAttributes: true,
      }),
      new webpack.DefinePlugin(replace),
    ],
  };

  exp.push(settings);
}

module.exports = exp;
