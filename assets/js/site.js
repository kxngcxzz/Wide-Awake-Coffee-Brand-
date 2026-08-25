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

  /* ---------- bag ---------- */
  var lines = [];
  var drawer = $('#drawer'), scrim = $('#scrim');
  var body = $('#drawerBody'), totalEl = $('#total'), countEl = $('#bagCount');

  var money = function (n) { return '£' + n.toFixed(2); };

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

  var draw = function () {
    if (!body) return;
    var count = 0, total = 0;
    lines.forEach(function (l) { count += l.qty; total += l.qty * l.amt; });

    if (!lines.length) {
      body.innerHTML = '<p class="drawer-empty">Nothing in here yet.</p>';
    } else {
      body.innerHTML = lines.map(function (l, idx) {
        return '<div class="line">' +
          '<img src="' + l.img + '" alt="">' +
          '<span><b>' + l.name + '</b><em>' + l.sub + '</em>' +
            '<span class="qty">' +
              '<button data-i="' + idx + '" data-d="-1" aria-label="One fewer">−</button>' +
              '<span>' + l.qty + '</span>' +
              '<button data-i="' + idx + '" data-d="1" aria-label="One more">+</button>' +
            '</span>' +
          '</span>' +
          '<span class="amt">' + money(l.qty * l.amt) + '</span>' +
        '</div>';
      }).join('');
    }

    if (totalEl) totalEl.textContent = money(total);
    if (countEl) {
      countEl.textContent = count;
      countEl.classList.add('pop');
      setTimeout(function () { countEl.classList.remove('pop'); }, 300);
    }
  };

  if (body) {
    body.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (!b) return;
      var l = lines[+b.dataset.i];
      if (!l) return;
      l.qty += +b.dataset.d;
      if (l.qty < 1) lines.splice(+b.dataset.i, 1);
      draw();
    });
  }

  $$('.add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.dataset.name;
      var found = null;
      lines.forEach(function (l) { if (l.name === name) found = l; });
      if (found) { found.qty++; }
      else {
        lines.push({
          name: name,
          sub:  btn.dataset.sub,
          img:  btn.dataset.img,
          amt:  parseFloat(btn.dataset.amt),
          qty:  1
        });
      }
      draw();
      openBag();
    });
  });

  var bagBtn = $('#bagBtn'), dClose = $('#drawerClose');
  if (bagBtn) bagBtn.addEventListener('click', openBag);
  if (dClose) dClose.addEventListener('click', closeBag);
  if (scrim)  scrim.addEventListener('click', closeBag);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBag(); closeSheet(); }
  });

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

  /* ---------- product page: option pickers ---------- */
  $$('[data-group]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var opt = e.target.closest('.opt');
      if (!opt) return;
      $$('.opt', group).forEach(function (o) { o.classList.remove('sel'); });
      opt.classList.add('sel');
      if (opt.dataset.amt) window.dispatchEvent(
        new CustomEvent('wa:price', { detail: parseFloat(opt.dataset.amt) })
      );
    });
  });

  window.addEventListener('wa:price', function (e) {
    var amt = e.detail;
    $$('[data-live-price]').forEach(function (el) { el.textContent = money(amt); });
    $$('.add').forEach(function (b) { if (b.dataset.live) b.dataset.amt = amt; });
    var cta = $('#buyLabel');
    if (cta) cta.textContent = 'Add to bag · ' + money(amt);
  });
})();
