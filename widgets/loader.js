/* Варианты виджета для A/B-теста.
   a/ — вариант А (виджет 1, капсула), b/ — вариант Б (с 2026-11-10 виджет 6 — карточка с превью услуг; раньше виджет 2, капля), c/ — вариант В (виджет 3, синяя карточка), d/ — вариант D (виджет 4, услуги над TLChat), d-solo/ — увеличенный D без TLChat, d-2/ — стеклянная группа (виджет 5).
   Вариант берётся из ?w=N, иначе из data-widget у этого <script>, иначе 1. ?w=0 — без виджета.
   Новый вариант: widgets/w<N>.css + widgets/w<N>.js. */
(function () {
  var me = document.currentScript;
  var solo = me.hasAttribute('data-widget-solo');
  var v = new URLSearchParams(location.search).get('w');
  if (v === null || v === '') v = me.getAttribute('data-widget') || '1';
  // Отвлекающий виджет — копия TL ИИ-чата (только вид, некликабельный); на всех вариантах, ?chat=0 — без него
  if (!solo && v !== '5') {
    var chat = document.createElement('script');
    chat.src = me.src.replace(/loader\.js.*$/, '') + 'tlchat.js?v=2'; chat.defer = true;
    if (v === '4') chat.setAttribute('data-widget-group', '');
    document.head.appendChild(chat);
  }
  // Отвлекающий виджет — копия новогодней акции с hotel-vega.ru (слева внизу, некликабельный); ?promo=0 — без него
  var promo = document.createElement('script');
  promo.src = me.src.replace(/loader\.js.*$/, '') + 'promo.js?v=2'; promo.defer = true;
  document.head.appendChild(promo);
  // Отвлекающий виджет — копия TL-слайдера акций с sochiparkhotel.ru (слева внизу; на мобилке — плашка «Акция»); ?slider=0 — без него
  var slider = document.createElement('script');
  slider.src = me.src.replace(/loader\.js.*$/, '') + 'tlslider.js?v=2'; slider.defer = true;
  document.head.appendChild(slider);
  if (v === '0' || !/^\d+$/.test(v)) return;
  var base = me.src.replace(/loader\.js.*$/, '');
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = base + 'w' + v + '.css?v=' + (v === '4' ? '17' : (v === '5' ? '13' : '10'));
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = base + 'w' + v + '.js?v=' + (v === '4' ? '14' : (v === '5' ? '13' : (v === '7' ? '12' : '11'))); js.defer = true;
  if (solo) js.setAttribute('data-widget-solo', '');
  document.head.appendChild(js);
  document.documentElement.setAttribute('data-widget', v);
})();
