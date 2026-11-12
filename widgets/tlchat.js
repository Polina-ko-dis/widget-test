/* Копия виджета TL ИИ-чата (как на hotel-vega.ru) — «отвлекающий» виджет для A/B-теста.
   Только вид: кнопка с роботом справа внизу и приветственный пузырь. Чат не открывается,
   никуда не переходит. Крестик просто прячет пузырь (как в оригинале).
   Цвет — синий кнопок сайта («Забронировать», #1743EF). В Shadow DOM, чтобы стили сайта не мешали.
   Подключается из loader.js на всех вариантах; ?chat=0 — без него. */
(function () {
  if (new URLSearchParams(location.search).get('chat') === '0') return;
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var C = '#1743EF', CH = '#1238CC';

  var btnHost = document.createElement('div');
  btnHost.className = 'tlc-btn-host';
  btnHost.style.cssText = 'position:fixed;z-index:2147483000;right:' + (mobile ? 13 : 13) + 'px;bottom:' + (mobile ? 13 : 17) + 'px;width:58px;height:58px';
  var bs = btnHost.attachShadow({ mode: 'open' });
  bs.innerHTML =
    '<style>:host{all:initial}.b{box-sizing:border-box;cursor:pointer;width:58px;height:58px;padding:3px;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}' +
    '.v{display:block;width:52px;height:52px;fill:#fff;color:' + C + '}.b:hover .v{color:' + CH + '}</style>' +
    '<div class="b" role="img" aria-label="ИИ-помощник"><svg class="v" fill="none" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">' +
    '<g filter="url(#f)" transform="translate(3, 3)"><g>' +
    '<path d="M26 1C46.8 1 51 5.2 51 26C51 46.8 46.8 51 26 51C5.2 51 1 46.8 1 26C1 5.2 5.2 1 26 1Z"></path>' +
    '<path clip-rule="evenodd" d="M26 0C46.8 0 52 5.2 52 26C52 46.8 46.8 52 26 52C5.2 52 0 46.8 0 26C0 5.2 5.2 0 26 0ZM26 4.55C8.84 4.55 4.55 8.84 4.55 26C4.55 43.16 8.84 47.45 26 47.45C43.16 47.45 47.45 43.16 47.45 26C47.45 8.84 43.16 4.55 26 4.55Z" fill="currentColor" fill-rule="evenodd"></path></g>' +
    '<g><path d="M8 26C8 11.6 11.6 8 26 8C40.4 8 44 11.6 44 26C44 40.4 40.4 44 26 44C11.6 44 8 40.4 8 26Z" fill="currentColor"></path>' +
    '<g><use href="#e" x="16"></use><use href="#e" x="30"></use><path d="M24 29H28C28 30.1046 27.1046 31 26 31C24.8954 31 24 30.1046 24 29Z"></path>' +
    '<defs><rect height="7" id="e" rx="2" width="6" y="22">' +
    // моргает: в оригинале один раз при загрузке, здесь — раз в 6 с
    '<animate attributeName="y" calcMode="discrete" dur="6s" begin="1s" keyTimes="0; 0.067; 0.1; 0.267; 0.3; 1" repeatCount="indefinite" values="22; 25; 22; 25; 22; 22"></animate>' +
    '<animate attributeName="height" calcMode="discrete" dur="6s" begin="1s" keyTimes="0; 0.067; 0.1; 0.267; 0.3; 1" repeatCount="indefinite" values="7; 1; 7; 1; 7; 7"></animate>' +
    '</rect></defs></g></g></g>' +
    '<defs><filter color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="58" id="f" width="58" x="-3" y="-3"><feFlood flood-opacity="0" result="B"></feFlood>' +
    '<feColorMatrix in="SourceAlpha" result="A" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="1.3"></feOffset><feGaussianBlur stdDeviation="0.975"></feGaussianBlur>' +
    '<feComposite in2="A" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix><feBlend in2="B" mode="normal" result="S"></feBlend><feBlend in="SourceGraphic" in2="S" mode="normal" result="shape"></feBlend></filter></defs>' +
    '</svg></div>';

  var msgHost = document.createElement('div');
  msgHost.className = 'tlc-msg-host';
  msgHost.style.cssText = 'position:fixed;z-index:2147483000;right:16px;bottom:' + (mobile ? 79 : 82) + 'px;max-width:' + (mobile ? 280 : 371) + 'px;width:' + (mobile ? 'calc(100vw - 32px)' : '371px') +
    ';background:#FAFAFA;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.15);opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease';
  var ms = msgHost.attachShadow({ mode: 'open' });
  ms.innerHTML =
    '<style>:host{all:initial}.m{position:relative;box-sizing:border-box;padding:12px;color:#313131;font-family:Arial,sans-serif;cursor:pointer}' +
    '.m:before{content:"";position:absolute;right:31px;bottom:-7px;width:14px;height:14px;background:#FAFAFA;box-shadow:6px 6px 12px rgba(0,0,0,.15);transform:rotate(45deg)}' +
    '.h{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;position:relative}.t{font-size:12px;font-weight:700}' +
    '.x{appearance:none;-webkit-appearance:none;background:none;border:none;box-sizing:border-box;color:' + C + ';cursor:pointer;display:flex;align-items:center;justify-content:center;width:24px;height:24px;margin:0;padding:3px}' +
    '.x svg{width:18px;height:18px}.tx{position:relative;display:inline-block;font-size:14px;line-height:20px}</style>' +
    '<div class="m"><div class="h"><span class="t">ИИ-помощник</span>' +
    '<button class="x" type="button" aria-label="Закрыть"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M20 5.6 18.4 4 12 10.4 5.6 4 4 5.6l6.4 6.4L4 18.4 5.6 20l6.4-6.4 6.4 6.4 1.6-1.6-6.4-6.4z"></path></svg></button></div>' +
    '<span class="tx">Отвечу на&nbsp;любой вопрос, помогу подобрать и&nbsp;забронировать номер и&nbsp;услуги&nbsp;— просто напишите мне.</span></div>';
  ms.querySelector('.x').addEventListener('click', function (e) {
    e.stopPropagation();
    msgHost.style.opacity = '0'; msgHost.style.transform = 'translateY(8px)';
    setTimeout(function () { msgHost.style.display = 'none'; }, 300);
  });

  function mount() {
    document.body.appendChild(msgHost);
    document.body.appendChild(btnHost);
    // пузырь появляется через 2 с, как у TL
    setTimeout(function () { msgHost.style.opacity = '1'; msgHost.style.transform = 'none'; }, 2000);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
