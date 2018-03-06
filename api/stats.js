const gzip = require('gzip-size');

const store = require('./utils/store');

const config = require('./config');

async function getFiles() {
  const css = await gzip(store.get('css'));
  const js = await gzip(store.get('js'));
  const html = (await gzip(store.get('html'))) - css - js;
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

  const images = (await store.get('db-images').distinct('url')).length;

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
      files: await getFiles(),
    },
    null,
    2
  );
}

module.exports = stats;
