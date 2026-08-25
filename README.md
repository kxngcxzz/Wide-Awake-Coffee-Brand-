# Wide Awake Coffee Co.

A concept direct-to-consumer coffee storefront. The brand is invented; the build is real.
Two pages, hand written, no framework and no build step.

**Live:** https://kxngcxzz.github.io/Wide-Awake-Coffee-Brand-/

## What it is

A subscription coffee shop for a fictional Bristol roaster that sells exactly two coffees,
Early and Later. The point of the project was to put a full conversion structure and a
strong visual identity in the same page, the way the better DTC brands do, rather than
picking one and settling for the other.

Designed first as artboards, then built. The homepage runs announcement bar, hero, feature
carousel, range, sourcing, an honest comparison table, reviews, subscription steps, FAQ and
a closing call to action. The product page runs gallery, buy box with purchase type, grind
and size, an origin strip, tasting profile and a brew guide.

## Built with

Plain HTML, CSS and JavaScript. No React, no Tailwind, no jQuery, no build tooling.
The whole site is two HTML files, one stylesheet and roughly two hundred lines of script.

- Layout with CSS grid and flexbox, fluid type with `clamp()`
- Product wordmarks set live over the photography using container query units, so the
  type scales with the image at any size instead of being baked into a JPEG
- Scroll reveals via `IntersectionObserver`, scroll handler throttled with
  `requestAnimationFrame`
- Header goes from transparent over the hero to solid, and hides on the way down
- Slide-in bag with quantity controls and a running subtotal
- Product options rewrite the price and the button label as you switch between them
- Fonts self hosted as woff2, so there is no third party request on load
- Every animation switches itself off under `prefers-reduced-motion`
- Keyboard reachable throughout, skip link, visible focus rings, labelled controls

## Files

```
index.html          homepage
product.html        product detail page
assets/css/         site.css, fonts.css
assets/js/site.js   all behaviour
assets/fonts/       self hosted woff2 subsets
assets/img/         photography
```

## Running it

It is static, so anything that serves files will do.

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Credits

Design and build by Casey Mungofa. Type is Young Serif and Geist, both open licence.
Wide Awake Coffee Co. is not a real company.
