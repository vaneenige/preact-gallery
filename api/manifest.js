function manifest(night) {
  const suffix = night ? '-night' : '';
  const color = night ? '#263238' : '#673ab8';
  return Buffer.from(
    JSON.stringify({
      name: 'Preact gallery',
      short_name: 'Gallery',
      icons: [
        {
          src: `/assets/icons/PG_144${suffix}.png`,
          type: 'image/png',
          sizes: '144x144',
        },
        {
          src: `/assets/icons/PG_192${suffix}.png`,
          type: 'image/png',
          sizes: '192x192',
        },
        {
          src: `/assets/icons/PG_512${suffix}.png`,
          type: 'image/png',
          sizes: '512x512',
        },
      ],
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: color,
      theme_color: color,
    }),
    'utf8'
  );
}

module.exports = manifest;
