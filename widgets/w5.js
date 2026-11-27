(function () {
  var base = document.currentScript.src.replace(/w5\.js.*$/, '');
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var servicesUrl = 'https://polina-ko-dis.github.io/uslugi-prototype/' + (mobile ? 'Main.html' : 'MainDesktop.html');
  var panel = document.createElement('aside');
  panel.className = 'gw5 has-hint';
  panel.setAttribute('aria-label', 'Услуги отеля и ИИ-помощник');

  function createIcon(isChat) {
    return '<span class="gw5__icon" aria-hidden="true">' +
      '<svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">' +
        '<g transform="translate(3,3)">' +
          '<path d="M26 1C46.8 1 51 5.2 51 26C51 46.8 46.8 51 26 51C5.2 51 1 46.8 1 26C1 5.2 5.2 1 26 1Z"/>' +
          '<path d="M26 0C46.8 0 52 5.2 52 26C52 46.8 46.8 52 26 52C5.2 52 0 46.8 0 26C0 5.2 5.2 0 26 0ZM26 4.55C8.84 4.55 4.55 8.84 4.55 26C4.55 43.16 8.84 47.45 26 47.45C43.16 47.45 47.45 43.16 47.45 26C47.45 8.84 43.16 4.55 26 4.55Z" fill="currentColor" fill-rule="evenodd"/>' +
          '<path d="M8 26C8 11.6 11.6 8 26 8C40.4 8 44 11.6 44 26C44 40.4 40.4 44 26 44C11.6 44 8 40.4 8 26Z" fill="currentColor"/>' +
          (isChat ? '<g class="gw5__eyes"><rect x="16" y="22" width="6" height="7" rx="2"/><rect x="30" y="22" width="6" height="7" rx="2"/></g><path d="M24 29H28C28 30.1046 27.1046 31 26 31C24.8954 31 24 30.1046 24 29Z"/>' : '') +
        '</g>' +
      '</svg>' +
      (isChat ? '' : '<img src="' + base + 'icons/service-white.svg" alt="">') +
    '</span>';
  }

  panel.innerHTML =
    '<div class="gw5__surface" aria-hidden="true"></div>' +
    '<a class="gw5__row gw5__services" data-allow-nav href="' + servicesUrl + '" aria-label="Услуги отеля" aria-describedby="gw5-services-hint">' +
      createIcon(false) +
    '</a>' +
    '<div class="gw5__row gw5__chat" role="img" aria-label="ИИ-Помощник" aria-describedby="gw5-chat-hint">' +
      createIcon(true) +
    '</div>' +
    '<div class="gw5__hint" role="group" aria-label="Подсказки об услугах и ИИ-Помощнике">' +
      '<p class="gw5__hint-text" id="gw5-services-hint"><span>Дополните проживание <strong>услугами</strong> из нашей витрины.</span></p>' +
      '<p class="gw5__hint-text" id="gw5-chat-hint"><span>Задайте <strong>ИИ-помощнику</strong> вопрос о проживании или нашем отеле.</span></p>' +
      '<button class="gw5__hint-close" type="button" aria-label="Закрыть подсказку"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 5.6 18.4 4 12 10.4 5.6 4 4 5.6l6.4 6.4L4 18.4 5.6 20l6.4-6.4 6.4 6.4 1.6-1.6-6.4-6.4z"/></svg></button>' +
    '</div>';
  document.body.appendChild(panel);

  var hint = panel.querySelector('.gw5__hint');
  var services = panel.querySelector('.gw5__services');
  var chat = panel.querySelector('.gw5__chat');
  var hintTimer;

  function closeHint() {
    if (hint.hidden) return;
    var restoreFocus = hint.contains(document.activeElement);
    clearTimeout(hintTimer);
    hint.hidden = true;
    panel.classList.remove('has-hint');
    services.removeAttribute('aria-describedby');
    chat.removeAttribute('aria-describedby');
    window.removeEventListener('scroll', closeHint);
    if (restoreFocus) services.focus({ preventScroll: true });
  }

  panel.querySelector('.gw5__hint-close').addEventListener('click', closeHint);
  window.addEventListener('scroll', closeHint, { passive: true });
  panel.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeHint();
  });
  hintTimer = setTimeout(closeHint, 5000);
})();
