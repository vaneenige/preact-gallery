import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

const uglifySettings = {
  compress: {
    negate_iife: false,
    unsafe_comps: true,
    properties: true,
    keep_fargs: false,
    pure_getters: true,
    collapse_vars: true,
    unsafe: true,
    warnings: false,
    sequences: true,
    dead_code: true,
    drop_debugger: true,
    comparisons: true,
    conditionals: true,
    evaluate: true,
    booleans: true,
    loops: true,
    unused: true,
    hoist_funs: true,
    if_return: true,
    join_vars: true,
    drop_console: true,
    pure_funcs: ['classCallCheck', 'invariant', 'warning'],
  },
  output: {
    comments: false,
  },
};

export default {
  input: 'src/index.js',
  output: {
    file: 'api/public/pg.js',
    format: 'iife',
    name: 'pg',
    sourcemap: false,
  },
  plugins: [
    /**
     * Seamless integration between Rollup and PostCSS.
     * @see https://github.com/egoist/rollup-plugin-postcss
     */
    postcss({
      extract: true,
      minimize: true,
    }),
    /**
     *  Convert ES2015 with buble.
     * @see https://github.com/rollup/rollup-plugin-buble
     */
    babel({
      babelrc: false,
      presets: [['es2015', { loose: true, modules: false }], 'stage-0'],
      plugins: ['external-helpers', ['transform-react-jsx', { pragma: 'h' }]],
    }),
    /**
     * Use the Node.js resolution algorithm with Rollup.
     * @see https://github.com/rollup/rollup-plugin-node-resolve
     */
    resolve({ jsnext: true }),
    /**
     * Convert CommonJS modules to ES2015.
     * @see https://github.com/rollup/rollup-plugin-commonjs
     */
    commonjs(),
    /**
     * Rollup plugin to minify generated bundle.
     * @see https://github.com/TrySound/rollup-plugin-uglify
     */
    uglify(uglifySettings),
  ],
};
