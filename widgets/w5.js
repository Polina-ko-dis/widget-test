(function () {
  var base = document.currentScript.src.replace(/w5\.js.*$/, '');
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var servicesUrl = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var panel = document.createElement('aside');
  panel.className = 'gw5';
  panel.setAttribute('aria-label', 'Услуги отеля и ИИ-помощник');

  function createIcon(isChat) {
    return '<span class="gw5__icon" aria-hidden="true">' +
      '<svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">' +
        '<g transform="translate(3,3)">' +
          '<path d="M26 1C46.8 1 51 5.2 51 26C51 46.8 46.8 51 26 51C5.2 51 1 46.8 1 26C1 5.2 5.2 1 26 1Z"/>' +
          '<path d="M26 0C46.8 0 52 5.2 52 26C52 46.8 46.8 52 26 52C5.2 52 0 46.8 0 26C0 5.2 5.2 0 26 0ZM26 4.55C8.84 4.55 4.55 8.84 4.55 26C4.55 43.16 8.84 47.45 26 47.45C43.16 47.45 47.45 43.16 47.45 26C47.45 8.84 43.16 4.55 26 4.55Z" fill="currentColor" fill-rule="evenodd"/>' +
          '<path d="M8 26C8 11.6 11.6 8 26 8C40.4 8 44 11.6 44 26C44 40.4 40.4 44 26 44C11.6 44 8 40.4 8 26Z" fill="currentColor"/>' +
          (isChat ? '<rect x="16" y="22" width="6" height="7" rx="2"/><rect x="30" y="22" width="6" height="7" rx="2"/><path d="M24 29H28C28 30.1046 27.1046 31 26 31C24.8954 31 24 30.1046 24 29Z"/>' : '') +
        '</g>' +
      '</svg>' +
      (isChat ? '' : '<img src="' + base + 'icons/service-white.svg" alt="">') +
    '</span>';
  }

  panel.innerHTML =
    '<div class="gw5__surface" aria-hidden="true"></div>' +
    '<a class="gw5__row gw5__services" id="gw5-services" data-allow-nav href="' + servicesUrl + '">' +
      '<span class="gw5__label">Услуги</span>' + createIcon(false) +
    '</a>' +
    '<button class="gw5__row gw5__chat" type="button" aria-controls="gw5-services" aria-expanded="true">' +
      '<span class="gw5__label">ИИ-Помощник</span>' + createIcon(true) +
    '</button>';
  document.body.appendChild(panel);

  var services = panel.querySelector('.gw5__services');
  var chat = panel.querySelector('.gw5__chat');
  var collapseTimer;

  function setCollapsed(collapsed) {
    clearTimeout(collapseTimer);
    if (collapsed && services.contains(document.activeElement)) chat.focus({ preventScroll: true });
    panel.classList.toggle('is-collapsed', collapsed);
    services.hidden = collapsed;
    chat.setAttribute('aria-expanded', String(!collapsed));
    chat.setAttribute('aria-label', collapsed ? 'Открыть услуги и ИИ-Помощника' : 'ИИ-Помощник — свернуть панель');
    if (!collapsed) collapseTimer = setTimeout(function () { setCollapsed(true); }, 7000);
  }

  chat.addEventListener('click', function () {
    setCollapsed(!panel.classList.contains('is-collapsed'));
  });
  panel.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !panel.classList.contains('is-collapsed')) {
      setCollapsed(true);
      chat.focus({ preventScroll: true });
    }
  });
  setCollapsed(false);
})();
