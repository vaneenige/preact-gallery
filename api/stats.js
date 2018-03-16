const gzip = require('gzip-size');
const brotli = require('brotli-size');

const store = require('./utils/store');

const config = require('./config');

const size = { uncompressed: str => Buffer.byteLength(str, 'utf8'), gzip, brotli: brotli.sync };

async function getFileSizes(type) {
  const css = await size[type](store.get('css'));
  const js = await size[type](store.get('js'));
  const html = (await size[type](store.get('html'))) - css - js;
  const total = html + css + js;

  return {
    total,
    js,
    css,
    html,
  };
}

async function getAnalytics() {
  const users = await store
    .get('db-views')
    .find()
    .count();

  const images = await store
    .get('db-images')
    .find()
    .count();

  const bytes = (await store
    .get('db-images')
    .find()
    .toArray()).reduce((acc, { bytes }) => acc + bytes, 0);

  return {
    users,
    images,
    bytes,
    readable: `${(bytes / 1e6).toFixed(2)}MB`,
  };
}

async function stats() {
  return JSON.stringify(
    {
      analytics: config.track ? await getAnalytics() : null,
      files: {
        uncompressed: await getFileSizes('uncompressed'),
        gzip: await getFileSizes('gzip'),
        brotli: await getFileSizes('brotli'),
      },
    },
    null,
    2
  );
}

module.exports = stats;
