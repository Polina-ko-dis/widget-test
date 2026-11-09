/* Виджет 1 (вариант А) — см. w1.css */
(function () {
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var URL_SERVICES = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var base = document.currentScript.src.replace(/w1\.js.*$/, '');
  var ARROW = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.6l-4.3-4.3a1 1 0 0 1 0-1.4z"/></svg>';
  var el = document.createElement('aside');
  el.className = 'gw1';
  el.setAttribute('aria-label', 'Услуги отеля');
  el.innerHTML =
    '<button class="gw1__toggle" type="button" aria-label="Услуги отеля" aria-expanded="false">' +
      '<span class="gw1__shadow" aria-hidden="true"></span>' +
      '<img class="gw1__img" src="' + base + 'icons/other2.svg" alt="">' +
    '</button>' +
    '<div class="gw1__body">' +
      '<p class="gw1__title">Услуги для вашего отдыха</p>' +
      '<a class="gw1__btn" data-allow-nav href="' + URL_SERVICES + '">Смотреть услуги' + ARROW + '</a>' +
    '</div>';
  var btn = el.querySelector('.gw1__toggle');
  function setOpen(v) { el.classList.toggle('is-open', v); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); }
  // Тап/клик по иконке открывает и закрывает; на тач-экране — тап по свёрнутому виджету тоже открывает
  btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!el.classList.contains('is-open')); });
  el.addEventListener('click', function (e) { if (!el.classList.contains('is-open') && !e.target.closest('.gw1__btn')) setOpen(true); });
  document.addEventListener('click', function (e) { if (!el.contains(e.target)) setOpen(false); });
  el.addEventListener('mouseleave', function () { setOpen(false); });
  document.body.appendChild(el);
})();
