function find(key) {
  const state = localStorage.getItem(`preact-gallery-${key}`);
  if (state === null) return null;
  return JSON.parse(state);
}

function insert(key, state) {
  localStorage.setItem(`preact-gallery-${key}`, JSON.stringify(state));
}

export default { find, insert };
