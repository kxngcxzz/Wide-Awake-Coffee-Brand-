/* ==========================================================================
   The bag page. Reads the same bag the drawer uses, so the two can never
   disagree. Delivery is free over £30, and a subscription line is 15% off
   the one-time price, which is what the saving line adds up.
   ========================================================================== */
(function () {
  'use strict';

  var BAG = window.WA_BAG;
  if (!BAG) return;

  var FREE_OVER = 30;
  var SHIPPING  = 3.5;

  var $ = function (s) { return document.querySelector(s); };
  var money = BAG.money;
  var esc = function (t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  var grid  = $('#cartGrid');
  var none  = $('#cartNone');
  var lines = $('#cartLines');

  var render = function () {
    var items = BAG.lines();
    var sub   = BAG.subtotal();

    /* empty bag swaps the whole grid out for the nudge */
    var isEmpty = items.length === 0;
    if (grid) grid.hidden = isEmpty;
    if (none) none.hidden = !isEmpty;
    if (isEmpty) return;

    if (lines) {
      lines.innerHTML = items.map(function (l, i) {
        return '<article class="cart-line">' +
          '<img src="' + esc(l.img) + '" alt="">' +
          '<div class="cart-line-main">' +
            '<h3>' + esc(l.name) + '</h3>' +
            '<p>' + esc(l.sub) + '</p>' +
            '<button class="cart-drop" data-drop="' + i + '">Remove</button>' +
          '</div>' +
          '<div class="cart-line-end">' +
            '<span class="qty">' +
              '<button data-nudge="' + i + '" data-d="-1" aria-label="One fewer ' + esc(l.name) + '">&minus;</button>' +
              '<span>' + l.qty + '</span>' +
              '<button data-nudge="' + i + '" data-d="1" aria-label="One more ' + esc(l.name) + '">+</button>' +
            '</span>' +
            '<span class="cart-amt">' + money(l.qty * l.amt) + '</span>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    /* what the subscription lines saved against the one-time price */
    var saved = items.reduce(function (t, l) {
      if (!/subscription/i.test(l.sub)) return t;
      var full = l.amt / 0.85;
      return t + (full - l.amt) * l.qty;
    }, 0);
    saved = Math.round(saved * 100) / 100;

    var ship = sub >= FREE_OVER ? 0 : SHIPPING;
    var gap  = Math.max(0, FREE_OVER - sub);

    var set = function (sel, txt) { var el = $(sel); if (el) el.textContent = txt; };
    set('#sumSub', money(sub));
    set('#sumSave', '−' + money(saved));
    set('#sumShip', ship ? money(ship) : 'Free');
    set('#sumTotal', money(sub + ship));

    var saveRow = $('#sumSaveRow');
    if (saveRow) saveRow.hidden = saved <= 0;

    set('#shipNote', gap > 0
      ? 'Spend ' + money(gap) + ' more for free delivery.'
      : 'Delivery is on us.');
    var fill = $('#shipFill');
    if (fill) fill.style.width = Math.min(100, (sub / FREE_OVER) * 100) + '%';
    var bar = $('#shipBar');
    if (bar) bar.classList.toggle('done', gap <= 0);
  };

  if (lines) {
    lines.addEventListener('click', function (e) {
      var n = e.target.closest('[data-nudge]');
      if (n) { BAG.nudge(+n.dataset.nudge, +n.dataset.d); return; }
      var d = e.target.closest('[data-drop]');
      if (d) BAG.drop(+d.dataset.drop);
    });
  }

  /* no real payment behind this, and saying so is better than a dead button */
  var pay = $('#payBtn');
  if (pay) {
    pay.addEventListener('click', function () {
      pay.disabled = true;
      pay.textContent = 'This is a concept store, so there is nothing to pay';
      setTimeout(function () {
        pay.disabled = false;
        pay.textContent = 'Go to payment';
      }, 2600);
    });
  }

  BAG.onChange(render);
})();
