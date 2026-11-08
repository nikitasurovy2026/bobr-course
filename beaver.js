/* Бобёр Тимка (SVG) и карта Беларуси */
window.Beaver = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var INK = '#24324d', BR = '#9b6a3c', BELLY = '#e6c79a', DK = '#5b3a1e', GREEN = '#2e8b57', RED = '#d64550';

  var STATIC =
    '<g transform="rotate(-28 150 214)"><ellipse cx="160" cy="216" rx="32" ry="13" fill="' + DK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M140 216 H182 M150 209 V223 M162 208 V224 M174 209 V223" stroke="#8a6338" stroke-width="2"/></g>' +
    '<ellipse cx="80" cy="236" rx="17" ry="7" fill="' + DK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<ellipse cx="120" cy="236" rx="17" ry="7" fill="' + DK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<ellipse cx="100" cy="158" rx="46" ry="54" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<ellipse cx="100" cy="170" rx="28" ry="36" fill="' + BELLY + '"/>' +
    '<path d="M76 122 L84 190 M124 122 L116 190" stroke="' + RED + '" stroke-width="6" stroke-linecap="round" fill="none"/>' +
    '<rect x="86" y="170" width="28" height="24" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2.500"/><path d="M92 178 H108 M92 184 H104" stroke="#8fb8d8" stroke-width="2"/>' +
    '<g class="wL"><path d="M68 128 Q38 150 44 188 Q64 194 72 172 Q80 150 76 134 Z" fill="' + BR + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><ellipse cx="55" cy="188" rx="10" ry="7" fill="' + DK + '"/></g>' +
    '<g class="wR"><g transform="translate(200 0) scale(-1 1)"><path d="M68 128 Q38 150 44 188 Q64 194 72 172 Q80 150 76 134 Z" fill="' + BR + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><ellipse cx="55" cy="188" rx="10" ry="7" fill="' + DK + '"/></g></g>' +
    '<circle cx="70" cy="46" r="13" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/><circle cx="70" cy="47" r="6" fill="#e9a3a3"/>' +
    '<circle cx="130" cy="46" r="13" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/><circle cx="130" cy="47" r="6" fill="#e9a3a3"/>' +
    '<circle cx="100" cy="76" r="37" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M66 54 Q100 12 134 54 Q100 46 66 54Z" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M60 56 Q100 68 140 56" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="100" cy="24" r="4" fill="#f6c744" stroke="' + INK + '" stroke-width="2"/>';

  function eye(type, cx) {
    var cy = 78, s = 'stroke="' + INK + '" stroke-width="4" stroke-linecap="round" fill="none"';
    if (type === 'happy') return '<path d="M' + (cx - 8) + ' ' + (cy + 4) + ' Q' + cx + ' ' + (cy - 10) + ' ' + (cx + 8) + ' ' + (cy + 4) + '" ' + s + '/>';
    if (type === 'star') return '<text x="' + cx + '" y="' + (cy + 8) + '" text-anchor="middle" font-size="22" fill="#f4b400" stroke="' + INK + '" stroke-width=".8">★</text>';
    var r = type === 'wide' ? 9 : 6.5, dx = 0, dy = 0;
    if (type === 'up') { dx = 2; dy = -3; }
    return '<g class="blink"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (cx - 2 + dx) + '" cy="' + (cy - 2.500 + dy) + '" r="2.400" fill="#fff"/></g>';
  }
  function brow(x1, y1, x2, y2) { return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + INK + '" stroke-width="3.500" stroke-linecap="round"/>'; }
  var CHEEK = '<circle cx="68" cy="94" r="7" fill="#ff9fb0" opacity=".7"/><circle cx="132" cy="94" r="7" fill="#ff9fb0" opacity=".7"/>';
  var TEETH = '<rect x="92" y="103" width="16" height="15" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="2.500"/><path d="M100 103 V118" stroke="' + INK + '" stroke-width="2"/>';
  var MOUTH = {
    smile: '<path d="M88 100 Q100 110 112 100" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' + TEETH,
    open: '<path d="M88 99 Q100 128 112 99 Z" fill="#7a1620" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/>' + TEETH,
    o: '<ellipse cx="100" cy="112" rx="9" ry="10" fill="#7a1620" stroke="' + INK + '" stroke-width="2.500"/>' + TEETH,
    flat: '<path d="M90 102 L110 101" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' + TEETH,
    frown: '<path d="M89 111 Q100 99 111 111" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' + TEETH
  };
  var NOSE = '<ellipse cx="100" cy="99" rx="23" ry="16" fill="' + BELLY + '"/><ellipse cx="100" cy="88" rx="8" ry="5.500" fill="#3b2412"/>';
  var CONF = '';
  [[30, 40, '#f6c744'], [170, 50, '#2e8b57'], [20, 100, '#d64550'], [180, 110, '#3d9bd6'], [50, 14, '#d64550'], [150, 16, '#f6c744']].forEach(function (c) {
    CONF += '<rect x="' + c[0] + '" y="' + c[1] + '" width="9" height="9" rx="2" fill="' + c[2] + '" transform="rotate(' + (c[0] * 3) + ' ' + c[0] + ' ' + c[1] + ')"/>';
  });
  var EXTRA = {
    think: '<g class="extra"><circle cx="165" cy="30" r="20" fill="#fff" stroke="' + INK + '" stroke-width="3"/><text x="165" y="39" text-anchor="middle" font-size="26" font-weight="800" fill="' + RED + '">?</text><circle cx="145" cy="54" r="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/></g>',
    wow: '<g class="extra"><text x="168" y="46" text-anchor="middle" font-size="40" font-weight="800" fill="' + RED + '">!</text></g>',
    sad: '<g class="extra"><path d="M74 90 Q69 101 74 104 Q79 101 74 90Z" fill="#8fd3f4" stroke="' + INK + '" stroke-width="1.500"/></g>',
    joy: '<g class="extra"><text x="24" y="40" font-size="24" fill="#f4b400">✦</text><text x="164" y="56" font-size="18" fill="#f4b400">✦</text></g>',
    cheer: '<g class="extra">' + CONF + '</g>'
  };
  var FACE = {
    hi: function () { return CHEEK + eye('open', 84) + eye('open', 116) + NOSE + MOUTH.smile; },
    joy: function () { return CHEEK + eye('happy', 84) + eye('happy', 116) + NOSE + MOUTH.open + EXTRA.joy; },
    wow: function () { return eye('wide', 84) + eye('wide', 116) + brow(74, 62, 94, 60) + brow(106, 60, 126, 62) + NOSE + MOUTH.o + EXTRA.wow; },
    think: function () { return eye('up', 84) + eye('up', 116) + brow(74, 66, 94, 66) + brow(106, 58, 126, 62) + NOSE + MOUTH.flat + EXTRA.think; },
    sad: function () { return eye('open', 84) + eye('open', 116) + brow(74, 70, 92, 63) + brow(108, 63, 126, 70) + NOSE + MOUTH.frown + EXTRA.sad; },
    wink: function () { return CHEEK + eye('happy', 84) + eye('open', 116) + NOSE + MOUTH.smile; },
    cheer: function () { return CHEEK + eye('star', 84) + eye('star', 116) + NOSE + MOUTH.open + EXTRA.cheer; }
  };
  var NAMES = { hi: 'Привет', joy: 'Радость', wow: 'Удивление', think: 'Думает', sad: 'Подсказывает', wink: 'Подмигивает', cheer: 'Праздник' };

  function make(emo) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 245');
    svg.setAttribute('class', 'beaver');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Бобёр Тимка');
    svg.innerHTML = STATIC + '<g class="face"></g>';
    set(svg, emo || 'hi');
    return svg;
  }
  function set(svg, emo) {
    if (!FACE[emo]) emo = 'hi';
    svg.dataset.emo = emo;
    svg.querySelector('.face').innerHTML = FACE[emo]();
  }

  /* упрощённая карта Беларуси: зелёное — низины, жёлтое — возвышенности, синее — вода */
  var OUT = '110,215 95,170 130,130 185,110 205,70 260,55 310,40 360,75 430,70 470,100 520,130 555,175 540,225 560,270 520,315 540,360 500,410 430,440 380,470 300,455 240,470 170,440 120,400 75,370 95,320 70,270';
  function mapInner() {
    return '<defs><clipPath id="bel"><polygon points="' + OUT + '"/></clipPath></defs>' +
      '<polygon points="' + OUT + '" fill="#bfe8c8" stroke="#2e8b57" stroke-width="4" stroke-linejoin="round"/>' +
      '<g clip-path="url(#bel)">' +
      '<ellipse cx="270" cy="232" rx="72" ry="36" transform="rotate(-18 270 232)" fill="#f9e29a"/>' +
      '<ellipse cx="170" cy="182" rx="48" ry="28" fill="#f9e29a"/>' +
      '<ellipse cx="435" cy="150" rx="58" ry="28" fill="#f9e29a"/>' +
      '<ellipse cx="480" cy="262" rx="38" ry="30" fill="#f9e29a"/>' +
      '<path class="river" stroke-width="6" d="M520 190 Q470 250 500 330 Q480 400 460 437"/>' +
      '<path class="river" stroke-width="4" d="M330 150 Q370 220 400 270 Q440 300 482 330"/>' +
      '<path class="river" stroke-width="5" d="M120 412 Q250 380 330 400 Q420 395 465 422"/>' +
      '<path class="river" stroke-width="3" d="M215 215 Q170 280 108 296"/>' +
      '<path class="river" stroke-width="4" d="M330 72 Q400 98 470 112"/>' +
      '<ellipse cx="216" cy="136" rx="17" ry="9" fill="#59b4ea"/>' +
      '<g fill="#59b4ea"><ellipse cx="322" cy="64" rx="9" ry="6"/><ellipse cx="345" cy="76" rx="7" ry="5"/><ellipse cx="306" cy="80" rx="6" ry="4"/></g>' +
      '</g>';
  }
  function mapSVG(inner) {
    return '<svg viewBox="0 0 620 500" role="img" aria-label="Карта Беларуси">' + mapInner() + (inner || '') + '</svg>';
  }
  return { make: make, set: set, mapSVG: mapSVG, NAMES: NAMES };
})();
