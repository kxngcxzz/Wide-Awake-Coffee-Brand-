/* ==========================================================================
   Wide Awake. Small, dependency free, and it all degrades to a working page
   if this file never loads.
   ========================================================================== */
(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- reveal on scroll ---------- */
  var rv = $$('.rv');
  if (calm || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---------- header: solid past the hero, hide on the way down ---------- */
  var hdr = $('#hdr');
  if (hdr) {
    var last = 0;
    var solid = hdr.hasAttribute('data-solid');
    var onScroll = function () {
      var y = window.pageYOffset;
      if (!solid) hdr.classList.toggle('stuck', y > window.innerHeight * 0.7);
      if (!calm) hdr.classList.toggle('hide', y > last && y > 420);
      last = y;
    };
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      window.requestAnimationFrame(function () { onScroll(); tick = false; });
    }, { passive: true });
    onScroll();
  }

  /* ---------- announcement rotator ---------- */
  var track = $('#annTrack');
  if (track && !calm) {
    var items = track.children.length, i = 0;
    setInterval(function () {
      i = (i + 1) % items;
      track.style.transform = 'translateY(' + (-44 * i) + 'px)';
    }, 4200);
  }

  /* ---------- carousel ---------- */
  var rail = $('#rail');
  if (rail) {
    var prev = $('#railPrev'), next = $('#railNext');
    var step = function () {
      var card = rail.querySelector('.slide');
      return card ? card.offsetWidth + 24 : 400;
    };
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
    };
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: calm ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left:  step(), behavior: calm ? 'auto' : 'smooth' }); });
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---------- faq: one open at a time ---------- */
  var qs = $$('.q');
  qs.forEach(function (q) {
    q.addEventListener('toggle', function () {
      if (!q.open) return;
      qs.forEach(function (o) { if (o !== q) o.open = false; });
    });
  });

  /* ---------- mobile sheet ---------- */
  var sheet = $('#sheet'), burger = $('#burger');
  var closeSheet = function () {
    if (!sheet) return;
    sheet.classList.remove('on');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      sheet.classList.add('on');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    var sc = $('#sheetClose');
    if (sc) sc.addEventListener('click', closeSheet);
    $$('a', sheet).forEach(function (a) { a.addEventListener('click', closeSheet); });
  }

  /* ---------- bag ----------
     Lines are keyed on name plus options, so Later as whole bean 250g and
     Later ground 500g are two lines rather than one confused one. The whole
     thing is mirrored into localStorage on every change, and other open tabs
     pick it up through the storage event. */
  var KEY = 'wa.bag.v1';
  var lines = [];
  var drawer = $('#drawer'), scrim = $('#scrim');
  var body = $('#drawerBody'), totalEl = $('#total'), countEl = $('#bagCount');

  var money = function (n) { return '£' + n.toFixed(2); };
  var esc = function (t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };
  var keyOf = function (l) { return l.name + '|' + l.sub; };
  var watchers = [];

  /* storage can throw outright in a locked-down browser, so every touch is guarded */
  var save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) {}
  };

  var load = function () {
    var raw;
    try { raw = localStorage.getItem(KEY); } catch (e) { return; }
    if (!raw) return;
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return; }
    if (!Array.isArray(parsed)) return;
    lines = parsed.filter(function (l) {
      return l && typeof l.name === 'string' && typeof l.img === 'string' &&
             isFinite(l.amt) && isFinite(l.qty) && l.qty > 0;
    }).map(function (l) {
      return {
        name: String(l.name),
        sub:  String(l.sub || ''),
        img:  String(l.img),
        amt:  Number(l.amt),
        qty:  Math.min(99, Math.max(1, Math.round(Number(l.qty))))
      };
    });
  };

  var openBag = function () {
    if (!drawer) return;
    drawer.classList.add('on');
    if (scrim) scrim.classList.add('on');
    document.body.style.overflow = 'hidden';
  };
  var closeBag = function () {
    if (!drawer) return;
    drawer.classList.remove('on');
    if (scrim) scrim.classList.remove('on');
    document.body.style.overflow = '';
  };

  var draw = function (pop) {
    var count = 0, total = 0;
    lines.forEach(function (l) { count += l.qty; total += l.qty * l.amt; });

    if (body) {
      if (!lines.length) {
        body.innerHTML = '<p class="drawer-empty">Nothing in here yet.</p>';
      } else {
        body.innerHTML = lines.map(function (l, idx) {
          return '<div class="line">' +
            '<img src="' + esc(l.img) + '" alt="">' +
            '<span><b>' + esc(l.name) + '</b><em>' + esc(l.sub) + '</em>' +
              '<span class="qty">' +
                '<button data-i="' + idx + '" data-d="-1" aria-label="One fewer ' + esc(l.name) + '">−</button>' +
                '<span>' + l.qty + '</span>' +
                '<button data-i="' + idx + '" data-d="1" aria-label="One more ' + esc(l.name) + '">+</button>' +
              '</span>' +
            '</span>' +
            '<span class="amt">' + money(l.qty * l.amt) + '</span>' +
          '</div>';
        }).join('');
      }
    }

    if (totalEl) totalEl.textContent = money(total);
    if (countEl) {
      countEl.textContent = count;
      if (pop && !calm) {
        countEl.classList.add('pop');
        setTimeout(function () { countEl.classList.remove('pop'); }, 300);
      }
    }

    watchers.forEach(function (fn) { fn(); });
  };

  if (body) {
    body.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (!b) return;
      var l = lines[+b.dataset.i];
      if (!l) return;
      l.qty += +b.dataset.d;
      if (l.qty < 1) lines.splice(+b.dataset.i, 1);
      save();
      draw();
    });
  }

  var addLine = function (btn) {
    var line = {
      name: btn.dataset.name,
      sub:  btn.dataset.sub || '',
      img:  btn.dataset.img,
      amt:  parseFloat(btn.dataset.amt),
      qty:  1
    };
    if (!line.name || !isFinite(line.amt)) return;

    var found = null;
    lines.forEach(function (l) { if (keyOf(l) === keyOf(line)) found = l; });
    if (found) found.qty = Math.min(99, found.qty + 1);
    else lines.push(line);

    save();
    draw(true);
    openBag();
  };

  /* delegated, so lines rendered later by product.js are covered too */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.add');
    if (btn) addLine(btn);
  });

  var bagBtn = $('#bagBtn'), dClose = $('#drawerClose');
  if (bagBtn) bagBtn.addEventListener('click', openBag);
  if (dClose) dClose.addEventListener('click', closeBag);
  if (scrim)  scrim.addEventListener('click', closeBag);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBag(); closeSheet(); }
  });

  /* The bag lives here. cart.html reads and nudges it through this, rather
     than keeping a second copy that could drift out of step. */
  window.WA_BAG = {
    lines: function () {
      return lines.map(function (l) {
        return { name: l.name, sub: l.sub, img: l.img, amt: l.amt, qty: l.qty };
      });
    },
    subtotal: function () {
      return lines.reduce(function (t, l) { return t + l.qty * l.amt; }, 0);
    },
    nudge: function (idx, delta) {
      var l = lines[idx];
      if (!l) return;
      l.qty = Math.min(99, l.qty + delta);
      if (l.qty < 1) lines.splice(idx, 1);
      save();
      draw();
    },
    drop: function (idx) {
      if (!lines[idx]) return;
      lines.splice(idx, 1);
      save();
      draw();
    },
    empty: function () { lines = []; save(); draw(); },
    onChange: function (fn) { watchers.push(fn); fn(); },
    money: money
  };

  /* another tab changed the bag */
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    load();
    draw();
  });

  load();
  draw();

  /* ---------- newsletter ---------- */
  var form = $('#signup');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var done = $('#signupDone');
      if (done) done.classList.add('on');
      form.reset();
    });
  }

  /* ---------- product page: option pickers ----------
     Selection only. product.js owns what the price does about it. */
  $$('[data-group]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var opt = e.target.closest('.opt');
      if (!opt) return;
      $$('.opt', group).forEach(function (o) {
        o.classList.remove('sel');
        o.setAttribute('aria-pressed', 'false');
      });
      opt.classList.add('sel');
      opt.setAttribute('aria-pressed', 'true');
    });
  });

})();
