import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.setContent('<div id="card">Hello</div>');
  await page.addScriptTag({ path: resolve('lib/animplus.js') });
  const results = await page.evaluate(() => {
    const { load, DomAdapter } = window.AnimPlus;
    const card = document.querySelector('#card');
    const run = load('reveal\n  find card\n  anim opacity from 0 time 1').prepare('reveal', document.body, { adapter: new DomAdapter() }).play();
    run.advance(.5); const halfway = Number(getComputedStyle(card).opacity);
    run.advance(.5); const status = run.status;
    run.reset(); const restored = card.style.opacity;
    const mouse = { x: 10, y: 20 };
    const live = load('let x = mouse.x\nfollow\n  find card\n  anim pos.x from x to x time 1 repeat -1').prepare('follow', document.body, { adapter: new DomAdapter(), bindings: { mouse, live: true } }).play();
    mouse.x = 40; live.advance(.1); const x = parseFloat(getComputedStyle(card).translate);
    live.reset();
    return { halfway, status, restored, x };
  });
  assert.deepEqual(results, { halfway: .5, status: 'Completed', restored: '', x: 40 });
  const esm = await readFile('lib/animplus.mjs', 'utf8');
  const esmResult = await page.evaluate(async source => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const module = await import(url); URL.revokeObjectURL(url);
    const run = module.load('fade\n  find card\n  anim opacity from 0 time 1').prepare('fade', document.body, { adapter: new module.DomAdapter() });
    run.seek(.25); const value = Number(getComputedStyle(document.querySelector('#card')).opacity); run.reset();
    return value;
  }, esm);
  assert.equal(esmResult, .25);
  console.log('Browser runtime checks passed: standalone script, ES module, DOM playback, reset and live mouse bindings.');
} finally { await browser.close(); }
