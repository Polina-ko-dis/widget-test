/* Виджет D — форма TLChat с иконкой услуг из варианта C. */
(function () {
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var URL_SERVICES = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var base = document.currentScript.src.replace(/w4\.js.*$/, '');
  var solo = document.currentScript.hasAttribute('data-widget-solo');
  var el = document.createElement('aside');
  el.className = 'gw4' + (solo ? ' gw4--solo' : '');
  el.setAttribute('aria-label', 'Услуги отеля');
  el.innerHTML =
    '<a class="gw4__link" data-allow-nav href="' + URL_SERVICES + '" aria-label="Услуги отеля" aria-describedby="gw4-hint">' +
      '<svg class="gw4__frame" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<g transform="translate(3,3)">' +
          '<path d="M26 1C46.8 1 51 5.2 51 26C51 46.8 46.8 51 26 51C5.2 51 1 46.8 1 26C1 5.2 5.2 1 26 1Z"/>' +
          '<path d="M26 0C46.8 0 52 5.2 52 26C52 46.8 46.8 52 26 52C5.2 52 0 46.8 0 26C0 5.2 5.2 0 26 0ZM26 4.55C8.84 4.55 4.55 8.84 4.55 26C4.55 43.16 8.84 47.45 26 47.45C43.16 47.45 47.45 43.16 47.45 26C47.45 8.84 43.16 4.55 26 4.55Z" fill="currentColor" fill-rule="evenodd"/>' +
          '<path d="M8 26C8 11.6 11.6 8 26 8C40.4 8 44 11.6 44 26C44 40.4 40.4 44 26 44C11.6 44 8 40.4 8 26Z" fill="currentColor"/>' +
        '</g>' +
      '</svg>' +
      '<img class="gw4__icon" src="' + base + 'icons/service-white.svg" alt="">' +
    '</a>' +
    '<div class="gw4__hint" id="gw4-hint" role="tooltip">Услуги отеля: СПА, баня, трансфер</div>';
  document.body.appendChild(el);
  function showHint(duration) {
    el.classList.add('is-hint-visible');
    setTimeout(function () { el.classList.remove('is-hint-visible'); }, duration);
  }
  // Solo знакомит с услугами сразу на 10 секунд. Обычный D сначала
  // даёт прочитать приветствие TLChat и показывает подсказку на 5 секунд.
  if (solo) showHint(10000);
  else setTimeout(function () { showHint(5000); }, 9000);
})();
