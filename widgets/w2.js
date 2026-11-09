/* Виджет 2 (вариант Б) — см. w2.css */
(function () {
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var URL_SERVICES = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var base = document.currentScript.src.replace(/w2\.js.*$/, '') + 'icons/';
  var ICONS = ['food', 'spa', 'bathhouse', 'transfer', 'excursion1', 'kid', 'gift', 'roomservice', 'animal', 'pool2'];
  var strip = [ICONS[ICONS.length - 1]].concat(ICONS, ICONS.slice(0, 2)); // бесшовная петля
  var ARROW = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.6l-4.3-4.3a1 1 0 0 1 0-1.4z"/></svg>';

  var pos = document.createElement('div');
  pos.className = 'gw2-pos';
  pos.innerHTML =
    '<aside class="gw2" aria-label="Услуги отеля">' +
      '<img class="gw2__shadow" src="' + base + 'w2-shadow.svg" alt="" aria-hidden="true">' +
      '<div class="gw2__glass"></div>' +
      '<img class="gw2__outline" src="' + base + 'w2-outline-blue.svg" alt="" aria-hidden="true">' +
      '<div class="gw2__window" aria-hidden="true"><ul class="gw2__strip">' +
        strip.map(function (n) { return '<li><img src="' + base + n + '.svg" alt=""></li>'; }).join('') +
      '</ul></div>' +
      '<div class="gw2__body">' +
        '<p class="gw2__title">Услуги для вашего отдыха</p>' +
        '<a class="gw2__btn" data-allow-nav href="' + URL_SERVICES + '">Смотреть услуги' + ARROW + '</a>' +
      '</div>' +
    '</aside>';
  var el = pos.firstChild;
  function setOpen(v) { el.classList.toggle('is-open', v); }
  el.addEventListener('click', function (e) { if (!el.classList.contains('is-open') && !e.target.closest('.gw2__btn')) setOpen(true); });
  document.addEventListener('click', function (e) { if (!el.contains(e.target)) setOpen(false); });
  el.addEventListener('mouseleave', function () { setOpen(false); });
  document.body.appendChild(pos);

  // Десктоп: при загрузке встаём центром на уровень кнопки «Найти», дальше — fixed (остаёмся на месте экрана)
  if (mobile) return;
  // Кнопка «Найти» занимает всю высоту формы поиска TL, поэтому берём центр формы
  function findSearchBtn() { return document.getElementById('tl-search-form'); }
  // Форма TL догружается и меняет высоту — пересчитываем, пока страница не прокручена
  function place() {
    if (window.scrollY > 5) return;
    var f = findSearchBtn(), r = f && f.getBoundingClientRect();
    if (!r || !r.height) return;
    var y = r.top + r.height / 2; // центр «Найти» в окне
    pos.style.top = Math.min(Math.max(y, 80), window.innerHeight - 70) + 'px';
  }
  [0, 300, 800, 1500, 3000, 5000].forEach(function (t) { setTimeout(place, t); });
  window.addEventListener('load', place);
  window.addEventListener('resize', place);
})();
