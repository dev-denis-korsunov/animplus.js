import { build } from 'esbuild';

await Promise.all([
  build({ entryPoints: ['dist/browser.js'], outfile: 'lib/animplus.js', bundle: true, minify: true, format: 'iife', globalName: 'AnimPlus', target: 'es2022' }),
  build({ entryPoints: ['dist/browser.js'], outfile: 'lib/animplus.mjs', bundle: true, minify: true, format: 'esm', target: 'es2022' })
]);
