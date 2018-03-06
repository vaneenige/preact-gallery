const send = require('@polka/send');
const fetch = require('node-fetch');
const Validator = require('better-validator');
const gzip = require('gzip-size');

const page = require('./page');
const stats = require('./stats');
const manifest = require('./manifest');
const store = require('./utils/store');
const atob = require('./utils/atob');
const track = require('./utils/track');

const static = [
  {
    path: '/',
    headers: { 'Content-Type': 'text/html' },
    interval: 0,
    update: async () => page(),
  },
  {
    path: '/sw.js',
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public,max-age=300',
    },
    interval: 0,
    update: () => store.get('sw'),
  },
  {
    path: '/manifest.json',
    headers: { 'Content-Type': 'application/json' },
    interval: 0,
    update: () => manifest(false),
  },
  {
    path: '/manifest-night.json',
    headers: { 'Content-Type': 'application/json' },
    interval: 0,
    update: () => manifest(true),
  },
  {
    path: '/stats',
    headers: { 'Content-Type': 'application/json' },
    interval: 10 * 1000,
    update: async () => stats(),
  },
  {
    path: '/lighthouse',
    headers: { 'Content-Type': 'text/html' },
    interval: 0,
    update: () => store.get('lighthouse'),
  },
];

function dynamic(server) {
  server.get('/image/:base64', async (req, res) => {
    const validator = new Validator();
    validator(req.params.base64)
      .isString()
      .isBase64();
    if (validator.run().length !== 0) {
      send(res, 404);
      return;
    }
    const result = await new Promise((resolve, reject) => {
      fetch(atob(req.params.base64)).then(response => resolve(response));
    });
    const supportedMimeTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    if (supportedMimeTypes.includes(result.headers.get('content-type'))) {
      track(req.headers['user-agent'], 'images', {
        url: req.params.base64,
        bytes: parseInt(result.headers.get('content-length'), 10),
      });
      send(res, 200, await result.buffer(), {
        'Content-Length': result.headers.get('content-length'),
      });
    } else {
      send(res, 404);
    }
  });
}

module.exports = { static, dynamic };
