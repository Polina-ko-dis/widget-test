/* Виджет Д — см. w6.css. Фото услуг — те же, что в витрине (Unsplash). */
(function () {
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var URL_SERVICES = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var U = function (id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=600&q=70'; };
  var S = [
    ['Стоун-терапия', 'от 5 200 ₽', U('1600334089648-b0d9d3028eb2')],
    ['Завтрак в номер', 'от 1 600 ₽', U('1596701062351-8c2c14d1fdd0')],
    ['Банный чан', 'от 4 000 ₽', U('1786359410265-86e20d5da810')],
    ['Прогулка на теплоходе', 'от 2 900 ₽', U('1782535163015-9d6d7a68b0e2')],
    ['Трансфер в аэропорт', 'от 3 900 ₽', U('1567808291548-fc3ee04dbcf0')]
  ];
  var X = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.7 5.3a1 1 0 0 0-1.4 1.4L10.6 12l-5.3 5.3a1 1 0 1 0 1.4 1.4l5.3-5.3 5.3 5.3a1 1 0 0 0 1.4-1.4L13.4 12l5.3-5.3a1 1 0 0 0-1.4-1.4L12 10.6 6.7 5.3z"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.6l-4.3-4.3a1 1 0 0 1 0-1.4z"/></svg>';
  var slides = '', bars = '', thumbs = '';
  S.forEach(function (s, i) {
    var d = (i * 3.2).toFixed(1) + 's';
    slides += '<div class="gw6__slide" style="animation-delay:' + d + '"><img class="gw6__img" src="' + s[2] + '" alt="" style="animation-delay:' + d + '">' +
      '<div class="gw6__cap" style="animation-delay:' + d + '"><span class="gw6__name">' + s[0] + '</span><span class="gw6__price">' + s[1] + '</span></div></div>';
    bars += '<span class="gw6__seg"><i style="animation-name:gw6-bar' + i + '"></i></span>';
    thumbs += '<img class="gw6__thumb" src="' + s[2] + '" alt="" style="animation-delay:' + d + '">';
  });
  var card = document.createElement('aside');
  card.className = 'gw6' + (mobile ? ' is-closed' : '');
  card.setAttribute('aria-label', 'Услуги отеля');
  card.innerHTML =
    '<div class="gw6__head"><span class="gw6__title">Услуги отеля</span><button class="gw6__x" type="button" aria-label="Свернуть">' + X + '</button></div>' +
    '<a class="gw6__view" data-allow-nav href="' + URL_SERVICES + '" aria-label="Смотреть услуги">' + slides + '<div class="gw6__bars" aria-hidden="true">' + bars + '</div></a>' +
    '<a class="gw6__btn" data-allow-nav href="' + URL_SERVICES + '">Все услуги' + ARROW + '</a>';
  var pill = document.createElement('button');
  pill.type = 'button';
  pill.className = 'gw6-pill' + (mobile ? ' is-on' : '');
  pill.setAttribute('aria-label', 'Показать услуги отеля');
  pill.innerHTML = '<span class="gw6-pill__ph" style="box-shadow:0 0 0 2px #1743EF">' + thumbs + '</span>Услуги';
  function setClosed(v) { card.classList.toggle('is-closed', v); pill.classList.toggle('is-on', v); }
  card.querySelector('.gw6__x').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); setClosed(true); });
  pill.addEventListener('click', function (e) { e.stopPropagation(); setClosed(false); });
  document.body.appendChild(card);
  document.body.appendChild(pill);
})();
