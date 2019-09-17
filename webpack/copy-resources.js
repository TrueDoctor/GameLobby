const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcFolder = './src/resources/';
const distFolder = './dist/resources/';
const output = './webpack/resources-output.json';
const hashableFiles = [];

let out = {replace: []};

// Resources

fs.mkdirSync(distFolder, {recursive: true});
fs.writeFileSync(output, JSON.stringify(out));

fs.readdirSync(srcFolder).forEach(file => {
  if (hashableFiles.includes(file)) {
    const stream = fs.createReadStream(srcFolder + file);
    const rawHash = crypto.createHash('md4');
    rawHash.setEncoding('hex');

    let sync = true;

    stream.on('end', () => {
      rawHash.end();
      const hash = rawHash.read().substring(0, 20);
      const newFileName = path.basename(file, path.extname(file)) + '.' + hash + path.extname(file);

      fs.copyFileSync(srcFolder + file, distFolder + newFileName);
      out.replace.push({'search': file, 'replace': newFileName});
      fs.writeFileSync(output, JSON.stringify(out));
    });

    stream.pipe(rawHash);
  } else {
    fs.copyFileSync(srcFolder + file, distFolder + file);
  }
});
