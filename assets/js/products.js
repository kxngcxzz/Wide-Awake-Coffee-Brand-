/* ==========================================================================
   The catalogue. One object per thing we sell, which is how a real store
   would hand this down from a CMS. product.js reads it, the pages render it.
   Prices are the one-time price. Subscription takes 15% off at render.
   ========================================================================== */
window.WA_PRODUCTS = {

  later: {
    slug:  'later',
    name:  'Later',
    tag:   'Dark roast',
    title: 'Later, dark roast from Colombian Huila | Wide Awake Coffee Co.',
    meta:  'Colombian Huila, roasted long and slow. Chocolate, cooked sugar and no sharp edges. Roasted Monday, with you Wednesday.',
    blurb: 'Colombian Huila, roasted long and slow. Chocolate, cooked sugar and no sharp edges. The one that holds up to milk.',
    rating: '4.8',
    reviews: '612',
    onDark: true,
    markSub: 'DARK ROAST · COLOMBIA',
    og: 'assets/img/og-later.jpg',
    gallery: [
      { src: 'assets/img/bag-later.jpg',   alt: 'Wide Awake Later, dark roast, 250g',        mark: true, thumbPos: '50% 10%', w: 1160, h: 2074 },
      { src: 'assets/img/roastery.jpg',    alt: 'Beans tipped into the cooling tray', w: 1200, h: 896 },
      { src: 'assets/img/mug-counter.jpg', alt: 'A mug of Later on a kitchen counter', w: 1200, h: 896 },
      { src: 'assets/img/pourover.jpg',    alt: 'Water poured over a paper filter', thumbPos: '50% 62%', w: 1200, h: 896 }
    ],
    grinds: ['Whole bean', 'Espresso', 'Filter', 'Cafetière'],
    sizes: [
      { label: '250g', amt: 12 },
      { label: '500g', amt: 21 },
      { label: '1kg',  amt: 38 }
    ],
    origin: [
      { k: 'Origin',      v: 'Huila',    n: 'Colombia, 1,600m' },
      { k: 'Process',     v: 'Washed',   n: 'Caturra &amp; Castillo' },
      { k: 'Roast level', v: 'Dark',     n: 'Second crack, just past' },
      { k: 'We paid',     v: '£4.85/kg', n: '2.4× the fairtrade floor' }
    ],
    taste: {
      head: 'Dark, but not burnt.',
      lede: 'We pull it just past second crack, which is where most dark roasts go wrong and keep going. You get the body and the sweetness without the ashtray finish.',
      bars: [
        { k: 'Body',      v: 'Heavy',  w: 88 },
        { k: 'Acidity',   v: 'Low',    w: 26 },
        { k: 'Sweetness', v: 'High',   w: 78 },
        { k: 'Roast',     v: 'Dark',   w: 82 }
      ]
    },
    brew: {
      head: 'Espresso, 1:2',
      lede: 'A starting point, not a rule. Adjust the grind before you adjust anything else.',
      rows: [
        { k: 'Dose',  v: '18g' },
        { k: 'Yield', v: '36g' },
        { k: 'Time',  v: '28 to 32s' },
        { k: 'Water', v: '93°C' }
      ]
    },
    also: ['early', 'pair', 'bulk']
  },

  early: {
    slug:  'early',
    name:  'Early',
    tag:   'Light roast',
    title: 'Early, light roast from Ethiopian Yirgacheffe | Wide Awake Coffee Co.',
    meta:  'Washed Ethiopian, roasted light. Bright and a bit floral, the sort of cup that makes you sit up. Roasted Monday, with you Wednesday.',
    blurb: 'Washed Ethiopian, roasted light. Bright and a bit floral, the sort of cup that makes you sit up. Best as filter or in an AeroPress.',
    rating: '4.7',
    reviews: '428',
    onDark: false,
    markSub: 'LIGHT ROAST · ETHIOPIA',
    og: 'assets/img/og-early.jpg',
    gallery: [
      { src: 'assets/img/bag-early.jpg', alt: 'Wide Awake Early, light roast, 250g',   mark: true, thumbPos: '50% 12%', w: 1160, h: 2280 },
      { src: 'assets/img/pourover.jpg',  alt: 'Early brewed as a pour over', thumbPos: '50% 62%', w: 1200, h: 896 },
      { src: 'assets/img/mug-hands.jpg', alt: 'Two hands around a mug of Early', w: 1200, h: 896 },
      { src: 'assets/img/roastery.jpg',  alt: 'Beans cooling after the Monday roast', w: 1200, h: 896 }
    ],
    grinds: ['Whole bean', 'Filter', 'AeroPress', 'Espresso'],
    sizes: [
      { label: '250g', amt: 12 },
      { label: '500g', amt: 21 },
      { label: '1kg',  amt: 38 }
    ],
    origin: [
      { k: 'Origin',      v: 'Yirgacheffe', n: 'Ethiopia, 1,850m' },
      { k: 'Process',     v: 'Washed',      n: 'Heirloom varietals' },
      { k: 'Roast level', v: 'Light',       n: 'Stopped before second crack' },
      { k: 'We paid',     v: '£5.40/kg',    n: '2.7× the fairtrade floor' }
    ],
    taste: {
      head: 'Bright, and it stays bright.',
      lede: 'Light roasting keeps the acidity that the farm put there in the first place. It tastes of lemon and something floral, and it will taste thin if you brew it like a dark roast, so give it a finer grind and a bit more patience.',
      bars: [
        { k: 'Body',      v: 'Light',  w: 32 },
        { k: 'Acidity',   v: 'High',   w: 86 },
        { k: 'Sweetness', v: 'Medium', w: 60 },
        { k: 'Roast',     v: 'Light',  w: 22 }
      ]
    },
    brew: {
      head: 'V60, 1:16',
      lede: 'A starting point, not a rule. If it tastes sour, grind finer. If it tastes hollow, grind coarser.',
      rows: [
        { k: 'Dose',  v: '22g' },
        { k: 'Water', v: '350g' },
        { k: 'Time',  v: '2:45 to 3:15' },
        { k: 'Temp',  v: '94°C' }
      ]
    },
    also: ['later', 'pair', 'bulk']
  },

  /* the two bundles. No page of their own, they only appear as cross-sells */
  pair: {
    slug: 'pair',
    name: 'Starter pair',
    sub:  'Early and Later, 250g each',
    blurb: 'Both roasts, one box. The easiest way to pick a side.',
    amt: 22,
    img: 'assets/img/bags.jpg', w: 1600, h: 1194,
    alt: 'Both Wide Awake roasts together',
    bothMarks: true
  },

  bulk: {
    slug: 'bulk',
    name: 'The 500g bag',
    sub:  'Later, 500g',
    blurb: 'Whichever roast you drink most, in a bigger bag. Cheaper per cup.',
    amt: 18,
    img: 'assets/img/roastery.jpg', w: 1200, h: 896,
    alt: 'Beans cooling after the roast'
  }
};
