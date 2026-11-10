/* Виджет 3 (вариант В) — см. w3.css */
(function () {
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var URL_SERVICES = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var base = document.currentScript.src.replace(/w3\.js.*$/, '');
  var ARROW = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.6l-4.3-4.3a1 1 0 0 1 0-1.4z"/></svg>';
  var el = document.createElement('aside');
  el.className = 'gw3';
  el.setAttribute('aria-label', 'Услуги отеля');
  el.innerHTML =
    '<button class="gw3__tab" type="button" aria-label="Услуги отеля" aria-expanded="false">' +
      '<img class="gw3__icon" src="' + base + 'icons/service-white.svg" alt="">' +
      '<span class="gw3__label">Услуги</span>' +
    '</button>' +
    '<div class="gw3__body">' +
      '<p class="gw3__title">СПА, баня, трансфер и другое</p>' +
      '<a class="gw3__btn" data-allow-nav href="' + URL_SERVICES + '">Смотреть услуги' + ARROW + '</a>' +
    '</div>';
  var tab = el.querySelector('.gw3__tab');
  function setOpen(v) { el.classList.toggle('is-open', v); tab.setAttribute('aria-expanded', v ? 'true' : 'false'); }
  tab.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!el.classList.contains('is-open')); });
  el.addEventListener('click', function (e) { if (!el.classList.contains('is-open') && !e.target.closest('.gw3__btn')) setOpen(true); });
  document.addEventListener('click', function (e) { if (!el.contains(e.target)) setOpen(false); });
  el.addEventListener('mouseleave', function () { setOpen(false); });
  document.body.appendChild(el);
})();
