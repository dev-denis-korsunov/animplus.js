# Anim+ Runtime

A browser library for executing procedural DOM animations. Includes a DOM adapter, live mouse bindings, and seamless alternating loops.

[Language standard](https://github.com/dev-denis-korsunov/animplus) · [DevTools editor](https://github.com/dev-denis-korsunov/anim-plus-chrome-extension)

## Use on a website

Copy [lib/animplus.js](lib/animplus.js) to your website. It exposes `AnimPlus` and includes everything needed to run animations. An [ES module](lib/animplus.mjs) is also available.

```html
<div id="card">Hello</div>
<script src="/lib/animplus.js"></script>
<script>
  const run = AnimPlus.load(`fade
  find card
  anim opacity from 0 time .4
`).prepare('fade', document.body, { adapter: new AnimPlus.DomAdapter() }).play();

  let previous = performance.now();
  requestAnimationFrame(function frame(now) {
    run.advance((now - previous) / 1000);
    previous = now;
    if (run.status === 'Active') requestAnimationFrame(frame);
  });
</script>
```

The host advances time in seconds. Use `pause()`, `seek(seconds)`, `reset()`, or `cancel()` to control playback. For live mouse input, pass `bindings: { mouse, live: true }` when preparing and update the mouse object's `x` and `y` from pointer events.

## Build

```sh
npm ci
npm run build
npm test
```

The committed browser bundles have no Vue or DevTools dependency. The npm package is not published to a registry.
