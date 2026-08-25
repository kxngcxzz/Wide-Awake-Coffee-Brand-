/* ==========================================================================
   Product page. One template, filled from products.js according to ?p= in
   the URL. Runs before site.js so the cart binds to a finished page.
   ========================================================================== */
(function () {
  'use strict';

  var DB = window.WA_PRODUCTS || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '£' + n.toFixed(2); };
  var dim = function (o) {
    return (o && o.w && o.h) ? ' width="' + o.w + '" height="' + o.h + '"' : '';
  };
  var esc = function (s) {
    return String(s).replace(/&(?![a-z]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  var slug = new URLSearchParams(location.search).get('p');
  var p = DB[slug];
  /* unknown or missing slug falls back to Later rather than showing an empty page */
  if (!p || !p.gallery) { slug = 'later'; p = DB.later; }
  if (!p) return;

  /* ---------- head ---------- */
  document.title = p.title;
  var desc = $('meta[name="description"]');
  if (desc) desc.setAttribute('content', p.meta);
  var canon = $('link[rel="canonical"]');
  if (canon) canon.href = location.origin + location.pathname + '?p=' + p.slug;

  /* ---------- breadcrumb ---------- */
  var crumb = $('#crumbNow');
  if (crumb) crumb.textContent = p.name;
  var crumbTag = $('#crumbTag');
  if (crumbTag) crumbTag.textContent = p.tag;

  /* ---------- gallery ---------- */
  var markHTML =
    '<div class="m1">WIDE<br>AWAKE</div>' +
    '<div class="m2">' + esc(p.name.toUpperCase()) + '</div>' +
    '<div class="m3">' + esc(p.markSub) + '</div>';

  var galMain = $('#galMain');
  if (galMain) {
    var first = p.gallery[0];
    galMain.innerHTML =
      '<img id="galImg" src="' + first.src + '" alt="' + esc(first.alt) + '"' +
      dim(first) + ' fetchpriority="high">' +
      '<div class="mark' + (p.onDark ? ' on-dark' : '') + '" id="galMark">' + markHTML + '</div>';
  }

  var thumbs = $('#thumbs');
  if (thumbs) {
    thumbs.innerHTML = p.gallery.map(function (g, i) {
      return '<button' + (i === 0 ? ' class="sel"' : '') +
        ' data-src="' + g.src + '" data-alt="' + esc(g.alt) + '"' +
        (g.mark ? ' data-mark="1"' : '') +
        ' aria-label="' + esc(g.alt) + '">' +
        '<img src="' + g.src + '" alt=""' + dim(g) + ' loading="lazy"' +
        (g.thumbPos ? ' style="object-position:' + g.thumbPos + '"' : '') + '></button>';
    }).join('');

    thumbs.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', thumbs).forEach(function (c) { c.classList.remove('sel'); });
      b.classList.add('sel');
      var img = $('#galImg'), mark = $('#galMark');
      if (img) { img.src = b.dataset.src; img.alt = b.dataset.alt || ''; img.classList.toggle('alt', !b.dataset.mark); }
      if (mark) mark.style.display = b.dataset.mark ? '' : 'none';
    });
  }

  /* ---------- buy box ---------- */
  var setText = function (sel, txt) { var el = $(sel); if (el) el.textContent = txt; };
  setText('#pName', p.name);
  setText('#pBlurb', p.blurb);
  setText('#pRating', p.rating + ' · ' + p.reviews + ' reviews');

  var grindBox = $('#grindOpts');
  if (grindBox) {
    grindBox.className = 'opts four';
    grindBox.innerHTML = p.grinds.map(function (g, i) {
      return '<button class="opt' + (i === 0 ? ' sel' : '') + '">' + esc(g) + '</button>';
    }).join('');
  }

  var sizeBox = $('#sizeOpts');
  if (sizeBox) {
    sizeBox.className = 'opts three';
    sizeBox.innerHTML = p.sizes.map(function (s, i) {
      return '<button class="opt' + (i === 0 ? ' sel' : '') + '" data-size="' + s.label +
        '" data-amt="' + s.amt + '">' + esc(s.label) + '</button>';
    }).join('');
  }

  var howBox = $('#howOpts');
  if (howBox) {
    howBox.innerHTML =
      '<button class="opt sel" data-sub="1">Subscribe<em>Save 15%, skip any time</em></button>' +
      '<button class="opt" data-sub="">One time<em id="oneTimeNote">' + money(p.sizes[0].amt) + ' the bag</em></button>';
  }

  /* ---------- price, which both option groups feed ---------- */
  var chosen = function (sel) { var el = $(sel + ' .opt.sel'); return el || null; };

  var reprice = function () {
    var sizeEl = chosen('#sizeOpts');
    var howEl  = chosen('#howOpts');
    var size   = sizeEl ? sizeEl.dataset.size : p.sizes[0].label;
    var base   = sizeEl ? parseFloat(sizeEl.dataset.amt) : p.sizes[0].amt;
    var sub    = howEl ? !!howEl.dataset.sub : true;
    var amt    = sub ? Math.round(base * 85) / 100 : base;

    $$('[data-live-price]').forEach(function (el) { el.textContent = money(amt); });
    setText('#priceNote', sub ? 'per bag on subscription, save 15%' : 'one bag, no commitment');
    setText('#oneTimeNote', money(base) + ' the bag');
    setText('#buyLabel', 'Add to bag · ' + money(amt));

    var grindEl = chosen('#grindOpts');
    var add = $('#addBtn');
    if (add) {
      add.dataset.name = p.name;
      add.dataset.amt  = amt;
      add.dataset.img  = p.gallery[0].src;
      add.dataset.sub  = [
        p.tag,
        grindEl ? grindEl.textContent.trim() : '',
        size,
        sub ? 'subscription' : 'one time'
      ].filter(Boolean).join(' · ');
    }
  };

  /* Selection is applied here rather than waiting on site.js, so the price
     updates in the same tick as the click no matter which script binds first. */
  $$('.field').forEach(function (f) {
    f.addEventListener('click', function (e) {
      var opt = e.target.closest('.opt');
      if (!opt) return;
      $$('.opt', f).forEach(function (o) {
        o.classList.remove('sel');
        o.setAttribute('aria-pressed', 'false');
      });
      opt.classList.add('sel');
      opt.setAttribute('aria-pressed', 'true');
      reprice();
    });
  });

  /* ---------- origin strip ---------- */
  var origin = $('#origin');
  if (origin) {
    origin.innerHTML = p.origin.map(function (o) {
      return '<div><span>' + esc(o.k) + '</span><b>' + esc(o.v) + '</b><em>' + o.n + '</em></div>';
    }).join('');
  }

  /* ---------- tasting ---------- */
  setText('#tasteHead', p.taste.head);
  setText('#tasteLede', p.taste.lede);
  var bars = $('#bars');
  if (bars) {
    bars.innerHTML = p.taste.bars.map(function (b) {
      return '<div class="bar"><span>' + esc(b.k) + ' <em>' + esc(b.v) + '</em></span>' +
        '<i><b style="--w:' + b.w + '%"></b></i></div>';
    }).join('');
  }

  /* ---------- brew ---------- */
  setText('#brewHead', p.brew.head);
  setText('#brewLede', p.brew.lede);
  var brew = $('#brew');
  if (brew) {
    brew.innerHTML = p.brew.rows.map(function (r) {
      return '<div><span>' + esc(r.k) + '</span><b>' + esc(r.v) + '</b></div>';
    }).join('');
  }

  /* ---------- goes well with ---------- */
  var also = $('#also');
  if (also) {
    also.innerHTML = p.also.map(function (key, i) {
      var o = DB[key];
      if (!o) return '';
      var delay = i ? ' style="transition-delay:.0' + (9 * i) + 's"' : '';

      /* a roast we have a page for, versus a bundle that only lives here */
      if (o.gallery) {
        var amt = Math.round(o.sizes[0].amt * 85) / 100;
        return '<article class="card rv"' + delay + '>' +
          '<a class="shot" href="product.html?p=' + o.slug + '">' +
            '<img src="' + o.gallery[0].src + '" alt="' + esc(o.gallery[0].alt) + '"' +
              dim(o.gallery[0]) + ' loading="lazy" decoding="async">' +
            '<div class="mark' + (o.onDark ? ' on-dark' : '') + '">' +
              '<div class="m1">WIDE<br>AWAKE</div><div class="m2">' + esc(o.name.toUpperCase()) + '</div>' +
            '</div>' +
          '</a>' +
          '<div class="card-top"><h3><a href="product.html?p=' + o.slug + '">' + esc(o.name) + '</a></h3>' +
            '<span class="price">' + money(amt) + '</span></div>' +
          '<p>' + esc(o.blurb) + '</p>' +
          '<button class="btn btn-ghost btn-block add" data-name="' + esc(o.name) + '"' +
            ' data-sub="' + esc(o.tag) + ' · Whole bean · ' + o.sizes[0].label + ' · subscription"' +
            ' data-img="' + o.gallery[0].src + '" data-amt="' + amt + '">Add ' + esc(o.name) + '</button>' +
        '</article>';
      }

      var marks = o.bothMarks
        ? '<div class="mark" style="left:26.2%;width:21.4%;top:41%">' +
            '<div class="m1" style="font-size:1.5cqw">WIDE<br>AWAKE</div>' +
            '<div class="m2" style="font-size:3.4cqw;margin-top:1.1cqw">EARLY</div></div>' +
          '<div class="mark on-dark" style="left:52.8%;width:23.2%;top:34.5%">' +
            '<div class="m1" style="font-size:1.5cqw">WIDE<br>AWAKE</div>' +
            '<div class="m2" style="font-size:3.4cqw;margin-top:1.1cqw">LATER</div></div>'
        : '';

      return '<article class="card rv"' + delay + '>' +
        '<div class="shot">' +
          '<img src="' + o.img + '" alt="' + esc(o.alt) + '"' + dim(o) +
            ' loading="lazy" decoding="async"' +
            ' style="aspect-ratio:4/3;object-position:50% 50%">' + marks +
        '</div>' +
        '<div class="card-top"><h3>' + esc(o.name) + '</h3>' +
          '<span class="price">' + money(o.amt) + '</span></div>' +
        '<p>' + esc(o.blurb) + '</p>' +
        '<button class="btn btn-ghost btn-block add" data-name="' + esc(o.name) + '"' +
          ' data-sub="' + esc(o.sub) + '" data-img="' + o.img + '" data-amt="' + o.amt + '">' +
          'Add the ' + esc(o.name.toLowerCase().replace('the ', '')) + '</button>' +
      '</article>';
    }).join('');
  }

  /* ---------- structured data, so the page describes itself properly ---------- */
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Wide Awake ' + p.name,
    description: p.meta,
    image: p.gallery[0].src,
    brand: { '@type': 'Brand', name: 'Wide Awake Coffee Co.' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      reviewCount: p.reviews
    },
    offers: p.sizes.map(function (s) {
      return {
        '@type': 'Offer',
        name: p.name + ', ' + s.label,
        price: s.amt.toFixed(2),
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock'
      };
    })
  });
  document.head.appendChild(ld);

  reprice();
})();
