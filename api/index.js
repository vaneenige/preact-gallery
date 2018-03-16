const path = require('path');

const polka = require('polka');
const MongoClient = require('mongodb').MongoClient;

const middleware = require('unvault-middleware');
const shrinkRay = require('shrink-ray');
const serveStatic = require('serve-static');

const routes = require('./routes');
const store = require('./utils/store');
const load = require('./utils/load');
const track = require('./utils/track');

const config = require('./config');

async function loadFiles() {
  const files = [
    {
      filename: '/sw.js',
      name: 'sw',
      collapse: true,
    },
    {
      filename: '/public/pg.css',
      name: 'css',
    },
    {
      filename: '/public/pg.js',
      name: 'js',
    },
    {
      filename: '/public/lighthouse.html',
      name: 'lighthouse',
    },
  ];
  return load(files, store);
}

async function initialize() {
  await loadFiles();
  const server = polka();
  server.use(
    'assets',
    serveStatic(path.join(__dirname, 'public'), {
      setHeaders(res) {
        res.setHeader('Cache-Control', `public,max-age=31536000,immutable`);
      },
    })
  );
  server.use(shrinkRay({ threshold: false, brotli: { quality: 11 } }));
  server.use((req, res, next) => {
    if (req.originalUrl === '/') track(req.headers['user-agent'], 'views');
    next();
  });
  server.use(middleware(routes.static));
  server.listen(4004);
  routes.dynamic(server);
}

if (config.track) {
  MongoClient.connect(config.mongodb, function(error, client) {
    if (error !== null) {
      console.log(error);
      return;
    }
    store.set('db-views', client.db('preact-gallery').collection('views'));
    store.set('db-images', client.db('preact-gallery').collection('images'));
    initialize();
  });
} else {
  initialize();
}
