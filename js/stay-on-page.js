/* Копия для A/B-теста: ни одна кнопка/ссылка не уводит с этой страницы.
   Блокируем: переходы по ссылкам (вкл. tel:, mailto:, _blank), window.open,
   отправку форм, программные переходы (Navigation API) и кнопки бронирования
   в форме поиска TL и на карте. Якоря (#...) и прокрутка работают. */
(function () {
  var BOOK = /^(найти|забронировать|забронировать номер)$/i;

  function isLeaving(href, win) {
    if (!href) return false;
    href = String(href).trim();
    if (href === '' || href.charAt(0) === '#' || /^javascript:/i.test(href)) return false;
    try {
      var u = new URL(href, win.location.href), cur = new URL(win.top.location.href);
      return !(u.origin === cur.origin && u.pathname === cur.pathname && u.search === cur.search);
    } catch (e) { return true; }
  }

  function guard(win) {
    if (!win || win.__stayGuard) return;
    try { win.__stayGuard = true; } catch (e) { return; }
    var doc = win.document;

    win.open = function () { return null; };

    var aClick = win.HTMLAnchorElement.prototype.click;
    win.HTMLAnchorElement.prototype.click = function () {
      if (isLeaving(this.getAttribute('href'), win) || this.target) return;
      return aClick.apply(this, arguments);
    };

    doc.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('a,button,[role=button]') : null;
      if (!el) return;
      var href = el.tagName === 'A' ? el.getAttribute('href') : null;
      var text = (el.innerText || el.textContent || '').trim();
      if (isLeaving(href, win) || (el.tagName === 'A' && el.target && href && href.charAt(0) !== '#')) {
        e.preventDefault();
      }
      if (BOOK.test(text)) {               // кнопки бронирования: гасим и их обработчики
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    doc.addEventListener('submit', function (e) { e.preventDefault(); e.stopImmediatePropagation(); }, true);

    // Фреймы без src (форма TL) — того же origin, ставим охрану и в них
    function watchFrames(root) {
      root.querySelectorAll('iframe').forEach(function (f) {
        var hook = function () { try { guard(f.contentWindow); } catch (e) {} };
        hook(); f.addEventListener('load', hook);
      });
    }
    new win.MutationObserver(function () { watchFrames(doc); })
      .observe(doc.documentElement, { childList: true, subtree: true });
  }

  guard(window);

  // Программные переходы (location.href = ..., top.location = ...)
  if (window.navigation && window.navigation.addEventListener) {
    window.navigation.addEventListener('navigate', function (e) {
      if (e.hashChange || e.downloadRequest) return;
      if (isLeaving(e.destination.url, window) && e.cancelable) e.preventDefault();
    });
  }
  window.addEventListener('DOMContentLoaded', function () {
    window.navigateToBookingPage = function () {};
  });
})();
