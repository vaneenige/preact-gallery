const gzip = require('gzip-size');
const minify = require('html-minifier').minify;

const store = require('./utils/store');
const { description } = require('./../package.json');

const meta = {
  title: 'Preact Gallery',
  description,
  image: 'https://preact.gallery/assets/icons/share.png',
  url: 'https://preact.gallery/',
  themeColor: '#673ab8',
};

module.exports = async () => {
  const { DEBUG = false } = process.env;
  const html = minify(
    `
    <html lang="en">
    <head>
      <title>${meta.title}</title>
    
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="description" content="${meta.description}">

      <meta property="og:title" content="${meta.title}">
      <meta property="og:description" content="${meta.description}">
      <meta property="og:image" content="${meta.image}">
      <meta property="og:url" content="${meta.url}">

      <meta name="twitter:card" content="summary_large_image">
      <meta name="theme-color" content="${meta.themeColor}">

      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">

      <link rel="manifest" href="/manifest.json">
      <link rel="icon" href="/assets/icons/favicon.ico">
      <link rel="apple-touch-icon" href="/assets/icons/PG_IOS.png">

      ${DEBUG ? `` : `<style>${store.get('css').toString()}</style>`}
    </head>

    <body>
      <div id="app">
        <div class="toolbar">
          <h1 class="toolbar-title">
            Preact Gallery
          </h1>
        </div>
      </div>
      <script>window.sw = ('serviceWorker' in navigator);</script>
      ${
        DEBUG
          ? `<script src="http://localhost:8080/bundle.js"></script>`
          : `<script>${store.get('js').toString()}</script>`
      }
      <script>if (window.sw) navigator.serviceWorker.register('/sw.js', { scope: '/' });</script>
    </body>

    </html>
  `,
    {
      collapseWhitespace: 'true',
    }
  );
  store.set('html', html);
  return Buffer.from(html, 'utf8');
};
