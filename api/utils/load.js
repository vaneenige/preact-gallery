const { version } = require('./../../package.json');
const fs = require('fs');
const minify = require('html-minifier').minify;

module.exports = (files, store) =>
  new Promise((resolve, reject) => {
    let count = files.length;
    for (let i = 0; i < files.length; i += 1) {
      const { filename, name, collapse = false } = files[i];
      fs.readFile(`${__dirname}/..${filename}`, 'utf8', (error, data) => {
        if (typeof data === 'undefined') {
          store.set(name, 'Resource not found!');
        } else {
          data = data.replace('__VERSION__', version);
          store.set(
            name,
            Buffer.from(
              collapse
                ? minify(data, {
                    collapseWhitespace: 'true',
                  })
                : data,
              'utf8'
            )
          );
        }
        count -= 1;
        if (count === 0) resolve();
      });
    }
  });
