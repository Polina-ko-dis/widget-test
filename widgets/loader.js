/* Варианты виджета для A/B-теста.
   a/ — вариант А (виджет 1, капсула), b/ — вариант Б (с 2026-11-10 виджет 6 — карточка с превью услуг; раньше виджет 2, капля), c/ — вариант В (виджет 3, синяя карточка).
   Вариант берётся из ?w=N, иначе из data-widget у этого <script>, иначе 1. ?w=0 — без виджета.
   Новый вариант: widgets/w<N>.css + widgets/w<N>.js. */
(function () {
  var me = document.currentScript;
  var v = new URLSearchParams(location.search).get('w');
  if (v === null || v === '') v = me.getAttribute('data-widget') || '1';
  if (v === '0' || !/^\d+$/.test(v)) return;
  var base = me.src.replace(/loader\.js.*$/, '');
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = base + 'w' + v + '.css?v=5';
  document.head.appendChild(css);
  var js = document.createElement('script');
  js.src = base + 'w' + v + '.js?v=4'; js.defer = true;
  document.head.appendChild(js);
  document.documentElement.setAttribute('data-widget', v);
})();
