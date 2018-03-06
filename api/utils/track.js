const store = require('./store');

const config = require('./../config');

function track(ua, type, payload = {}) {
  if (config.track === false) return;
  const collection = store.get(`db-${type}`);
  const time = Date.now().toString();
  collection.insert({ ua, time, ...payload });
}

module.exports = track;
