/* Копия «виджета объявлений» с hotel-vega.ru (новогодняя акция) — отвлекающий виджет для A/B-теста.
   Только вид: карточка слева вверху (top 220 — второй вариант позиции оригинала; слева внизу стоит TL-слайдер), выезжает через 4 с. «Подробнее» и «Реклама» никуда не ведут,
   крестик прячет карточку (как в оригинале). Цвет — синий кнопок сайта (#1743EF) вместо зелёного Веги.
   Мобилка (≤ 540): во всю ширину снизу, без картинки, выезжает снизу.
   Подключается из loader.js на всех вариантах; ?promo=0 — без него. */
(function () {
  if (new URLSearchParams(location.search).get('promo') === '0') return;
  var C = '#1743EF';
  var base = document.currentScript.src.replace(/widgets\/promo\.js.*$/, '');
  var host = document.createElement('div');
  host.className = 'promo-host';
  host.style.cssText = 'position:fixed;z-index:9980;left:0;bottom:0;width:0;height:0';
  var s = host.attachShadow({ mode: 'open' });
  s.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '.w{position:fixed;left:calc(-100% - 440px);top:220px;max-width:440px;background:#fff;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.25);overflow:hidden;font-family:Arial,sans-serif;' +
    '  transition:left 1s cubic-bezier(.42,.03,0,1.09),bottom 1s cubic-bezier(.42,.03,0,1.09)}' +
    '.w.on{left:30px}' +
    '.it{position:relative;display:flex;min-height:160px}' +
    '.img{flex-shrink:0;width:144px;height:216px;object-fit:cover;display:block}' +
    '.c{display:flex;flex-direction:column;row-gap:8px;padding:14px 32px 14px 14px}' +
    '.t{margin:0;color:#3D3D3D;font-size:16px;font-weight:600;line-height:1.3}' +
    '.d{margin:0;color:#3D3D3D;font-size:12px;line-height:1.2}' +
    '.n{margin:0;color:#A7A7A7;font-size:10.8px;line-height:1.1}' +
    '.more{align-self:flex-start;margin-top:auto;padding:.6em .8em;color:#fff;font-size:12px;font-weight:600;line-height:1;background:' + C + ';border:0;border-radius:3px;cursor:pointer;font-family:inherit;transition:opacity .3s}' +
    '.more:hover{opacity:.75}' +
    '.ad{position:absolute;left:0;top:0;display:inline-flex;align-items:center;column-gap:10px;padding:.3em .4em;color:#fff;font-size:13px;line-height:1;background:' + C + ';border:0;cursor:pointer;font-family:inherit}' +
    '.ad svg{width:3px;height:13px}' +
    '.x{position:absolute;top:5px;right:0;z-index:1;width:32px;height:32px;padding:0;background:none;border:0;cursor:pointer;transition:opacity .3s}' +
    '.x:hover{opacity:.45}' +
    '.x:before,.x:after{content:"";position:absolute;left:15px;top:7px;height:17px;width:2px;background:' + C + '}' +
    '.x:before{transform:rotate(45deg)}.x:after{transform:rotate(-45deg)}' +
    '@media (max-width:540px){' +
    '  .w{left:12px;right:12px;top:auto;bottom:-100%;max-width:none;transition:bottom 1s cubic-bezier(.42,.03,0,1.09)}' +
    '  .w.on{left:12px;bottom:30px}' +
    '  .it{min-height:140px}.img{display:none}' +
    '  .ad{left:auto;top:auto;right:0;bottom:0;font-size:12px}' +
    '}' +
    '</style>' +
    '<aside class="w" aria-label="Виджет объявлений"><div class="it">' +
    '<img class="img" src="' + base + 'img/promo-ny.jpg" alt="">' +
    '<div class="c">' +
    '<h3 class="t">Новогодняя ночь в стиле диско!</h3>' +
    '<p class="d">Встречайте Новый Год под любимые хиты золотой эпохи диско. Яркий праздник, где музыка – ваш главный танцевальный партнер!<br>' +
    'В эту ночь она станет вашим проводником в мир блеска и драйва: зажигайте танцпол под легендарные ритмы в исполнении кавер-группы, под DJ-сет и современные ремиксы.</p>' +
    '<p class="n">31 декабря, в 20:00</p>' +
    '<button class="more" type="button">Подробнее</button>' +
    '</div>' +
    '<button class="ad" type="button">Реклама<svg viewBox="0 0 3 13" fill="currentColor" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5"/><circle cx="1.5" cy="6.5" r="1.5"/><circle cx="1.5" cy="11.5" r="1.5"/></svg></button>' +
    '</div>' +
    '<button class="x" type="button" aria-label="Закрыть виджет объявлений"></button>' +
    '</aside>';
  var w = s.querySelector('.w');
  s.querySelector('.x').addEventListener('click', function (e) { e.stopPropagation(); w.classList.remove('on'); });
  function mount() {
    document.body.appendChild(host);
    setTimeout(function () { w.classList.add('on'); }, 4000); // как data-open-time-delay="4"
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
