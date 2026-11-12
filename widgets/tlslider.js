/* Копия TL-смарт-виджета «Слайдер» с sochiparkhotel.ru — отвлекающий виджет для A/B-теста.
   Десктоп: карточка 464 слева внизу, 3 акции, точки и стрелки листают; цвета как в оригинале, кроме кнопки «Бронирую» — она синяя сайта (#1743EF, 2026-11-12).
   «Бронирую» никуда не ведёт, крестик прячет виджет (как в оригинале — целиком).
   Мобилка (≤ 600): только свёрнутая плашка «👑 Акция» слева внизу, перекрашена в синий сайта (#1743EF), некликабельна.
   Картинки — img/tlslide-*.jpg (скачаны с TL с разрешения Полины). Подключается из loader.js; ?slider=0 — без него. */
(function () {
  if (new URLSearchParams(location.search).get('slider') === '0') return;
  var mobile = window.matchMedia('(max-width: 600px)').matches;
  var base = document.currentScript.src.replace(/widgets\/tlslider\.js.*$/, '');
  var host = document.createElement('div');
  host.className = 'tlslider-host';
  host.style.cssText = 'position:fixed;z-index:9985;left:0;bottom:0;width:0;height:0';
  var s = host.attachShadow({ mode: 'open' });
  var ARROW = '<svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M9.61642 2.20498L4.61642 7.20498H21.2064V9.20498H4.61642L9.61642 14.205L8.20642 15.615L0.796421 8.20498L2.00003 7.00137V6.99999H2.00141L8.20642 0.794983L9.61642 2.20498Z" fill="currentColor"/></svg>';
  var X = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.5L10.5 0L6 4.5L1.5 0L0 1.5L4.5 6L0 10.5L1.5 12L6 7.5L10.5 12L12 10.5L7.5 6L12 1.5Z" fill="currentColor"/></svg>';
  var CROWN = '<svg viewBox="0 0 64 64" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 54C12 53.4477 12.4477 53 13 53H51C51.5523 53 52 53.4477 52 54C52 54.5523 51.5523 55 51 55H13C12.4477 55 12 54.5523 12 54Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32 15C33.1046 15 34 14.1046 34 13C34 11.8954 33.1046 11 32 11C30.8954 11 30 11.8954 30 13C30 14.1046 30.8954 15 32 15ZM32 17C34.2091 17 36 15.2091 36 13C36 10.7909 34.2091 9 32 9C29.7909 9 28 10.7909 28 13C28 15.2091 29.7909 17 32 17Z" fill="currentColor"/><path d="M58 28C58 29.1046 57.1046 30 56 30C54.8954 30 54 29.1046 54 28C54 26.8954 54.8954 26 56 26C57.1046 26 58 26.8954 58 28Z" fill="currentColor"/><path d="M10 28C10 29.1046 9.10457 30 8 30C6.89543 30 6 29.1046 6 28C6 26.8954 6.89543 26 8 26C9.10457 26 10 26.8954 10 28Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M50.2653 49L52.5014 33.3474L42.3503 38.0068C40.8259 38.7065 39.0239 38.0204 38.3509 36.484L31.9372 21.8415L25.0346 36.5505C24.3266 38.0592 22.5247 38.7017 21.0219 37.9813L11.5089 33.4208L13.7345 49H50.2653ZM51.1326 51C51.6303 51 52.0522 50.6341 52.1226 50.1414L54.7406 31.8151C54.8526 31.0315 54.0529 30.4347 53.3335 30.7649L41.516 36.1891C41.0079 36.4224 40.4072 36.1937 40.1829 35.6815L32.8845 19.0196C32.5398 18.2324 31.4284 18.218 31.0633 18.9959L23.2241 35.7009C22.9881 36.2038 22.3874 36.4179 21.8865 36.1778L10.6867 30.8086C9.96613 30.4632 9.15147 31.0607 9.26448 31.8518L11.8773 50.1414C11.9477 50.6341 12.3696 51 12.8672 51H51.1326Z" fill="currentColor"/></svg>';

  if (mobile) {
    s.innerHTML =
      '<style>:host{all:initial}*{box-sizing:border-box}' +
      '.b{position:fixed;left:16px;bottom:76px;display:inline-flex;align-items:center;height:56px;padding:12px;border-radius:28px;background:#1743EF;color:#fff;' +
      'box-shadow:0 0 16px rgba(0,0,0,.15);font-family:Arial,Helvetica,Tahoma,"Open Sans",sans-serif;cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;' +
      'transform:translateX(-140%);transition:transform .6s cubic-bezier(.42,.03,0,1.09)}' +
      '.b.on{transform:none}' +
      '.i{width:32px;min-width:32px;height:32px;display:flex;align-items:center;filter:drop-shadow(0 0 4px rgba(0,0,0,.25))}.i svg{width:100%;height:100%}' +
      '.l{margin-left:8px;padding-right:8px;text-transform:uppercase;font-weight:bold;font-size:13px;white-space:nowrap;filter:drop-shadow(0 0 4px rgba(0,0,0,.25));' +
      'max-width:0;opacity:0;overflow:hidden;transition:max-width .4s ease-out .3s,opacity .3s ease-out .5s}' +
      '.b.on .l{max-width:160px;opacity:1}' +
      '</style><div class="b" role="img" aria-label="Акция"><div class="i">' + CROWN + '</div><div class="l">Акция</div></div>';
  } else {
    var S = [
      [1, 'Сказочный тариф', 'Обед или ужин в подарок в честь Дня рождения Бабы Яги!', '', '57% 50%'],
      [2, 'НОВЫЙ ГОД&nbsp;2027', 'Отправляйтесь в новогоднее путешествие&nbsp;к морю!', 'Новогодний ужин, праздничная анимация, подарки, бассейн с подогревом.', '44% 100%'],
      [3, 'РАННЕЕ БРОНИРОВАНИЕ', 'Скидка 15% на отдых при бронировании за&nbsp;30 суток до даты заезда', 'Завтрак * Подогреваемые бассейны * Анимация&nbsp;', '45% 50%']
    ];
    var slides = S.map(function (x, i) {
      return '<div class="sl' + (i === 0 ? ' a' : '') + '" style="transform:translateX(' + (i * 100) + '%)">' +
        '<div class="img" style="background-image:url(' + base + 'img/tlslide-' + x[0] + '.jpg);background-position:' + x[4] + '"></div>' +
        '<div class="c' + (x[3] ? ' wd' : '') + '"><div class="t">' + x[1] + '</div><div class="tx">' + x[2] + '</div>' +
        (x[3] ? '<div class="ds">' + x[3] + '</div>' : '') + '<div class="btn">БРОНИРУЮ</div></div>' +
        '<div class="x" role="button" aria-label="Закрыть">' + X + '</div></div>';
    }).join('');
    s.innerHTML =
      '<style>:host{all:initial}*{box-sizing:border-box}' +
      '.w{position:fixed;left:12px;bottom:91px;width:464px;padding:12px;font-family:Arial,Helvetica,Tahoma,"Open Sans",sans-serif;transform:translateX(calc(-100% - 20px));transition:transform 1s cubic-bezier(.42,.03,0,1.09)}' +
      '.w.on{transform:none}.w.off{transform:translateX(calc(-100% - 20px));transition:transform 1s cubic-bezier(1,-.09,.7,.97)}' +
      '.ct{filter:drop-shadow(0 0 8px rgba(0,0,0,.25))}' +
      '.ls{position:relative;overflow:hidden;border-radius:6px 6px 0 0;height:182px}' +
      '.sl{display:flex;position:absolute;left:0;bottom:0;width:100%;height:100%;transition:all .15s;opacity:0}.sl.a{opacity:1}' +
      '.img{flex:0 0 144px;width:144px;background-repeat:no-repeat;background-size:cover}' +
      '.c{flex:1 1 auto;padding:16px 16px 16px 24px;position:relative;color:#3D3D3D;background:#fff;width:100%}' +
      '.c>*:not(:last-child){margin-bottom:16px}' +
      '.t{font-weight:bold;line-height:20px;padding-right:20px;font-size:16px;color:#3D3D3D;word-break:break-word}' +
      '.tx{opacity:.8;line-height:18px;font-size:12px;color:#3D3D3D;word-break:break-word}' +
      '.ds{opacity:.45;font-size:10.8px;line-height:12px;color:#3D3D3D}.c.wd .ds{margin-top:-8px;margin-bottom:12px}' +
      '.btn{display:inline-flex;justify-content:center;cursor:pointer;line-height:18px;font-weight:bold;padding:8px;font-size:12px;background:#1743EF;color:#fff;border-radius:3px}.btn:hover{opacity:.9}' +
      '.x{cursor:pointer;position:absolute;right:0;top:0;display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:8px;opacity:.3;color:#3D3D3D}.x:hover{opacity:.6}' +
      '.bar{display:flex;background:#eee;border-radius:0 0 6px 6px;height:36px}' +
      '.pts{display:flex;align-items:center;justify-content:center;flex:1;padding:0 12px}' +
      '.pt{width:8px;height:8px;background:#c4c4c4;border-radius:50%;transition:background-color .3s;cursor:pointer}.pt:not(:last-child){margin-right:8px}.pt.a{background:#4380c6;pointer-events:none}' +
      '.ar{padding:0 16px;cursor:pointer;display:flex;align-items:center;color:#4380c6;transition:opacity .3s}.ar:hover{color:#075bba}.ar.r{transform:scale(-1)}.ar.h{opacity:0;pointer-events:none}' +
      '</style>' +
      '<div class="w"><div class="ct"><div class="ls">' + slides + '</div>' +
      '<div class="bar"><div class="ar l h">' + ARROW + '</div><div class="pts"><div class="pt a"></div><div class="pt"></div><div class="pt"></div></div><div class="ar r">' + ARROW + '</div></div>' +
      '</div></div>';
    var w = s.querySelector('.w'), sl = s.querySelectorAll('.sl'), pt = s.querySelectorAll('.pt');
    var L = s.querySelector('.ar.l'), R = s.querySelector('.ar.r'), cur = 0;
    function go(n) {
      cur = Math.max(0, Math.min(sl.length - 1, n));
      sl.forEach(function (e, i) { e.style.transform = 'translateX(' + ((i - cur) * 100) + '%)'; e.classList.toggle('a', i === cur); });
      pt.forEach(function (e, i) { e.classList.toggle('a', i === cur); });
      L.classList.toggle('h', cur === 0); R.classList.toggle('h', cur === sl.length - 1);
    }
    L.addEventListener('click', function () { go(cur - 1); });
    R.addEventListener('click', function () { go(cur + 1); });
    pt.forEach(function (e, i) { e.addEventListener('click', function () { go(i); }); });
    s.querySelectorAll('.x').forEach(function (e) { e.addEventListener('click', function () { w.classList.remove('on'); w.classList.add('off'); }); });
  }

  function mount() {
    document.body.appendChild(host);
    var el = s.querySelector(mobile ? '.b' : '.w');
    setTimeout(function () { el.classList.add('on'); }, 3000);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
