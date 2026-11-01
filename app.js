(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var NS = 'http://www.w3.org/2000/svg';
  var INK = '#24324d', RED = '#c8313e';

  /* ---------- Бобр (SVG) ---------- */
  var EMO_NAMES = { hi: 'Привет', joy: 'Радость', wow: 'Удивление', think: 'Думает', sad: 'Грустит', wink: 'Подмигивает', cheer: 'Праздник' };

  var BR = '#9b6a3c', BELLY = '#e6c79a', DK = '#5b3a1e';
  var STATIC =
    '<g transform="rotate(-28 150 214)"><ellipse cx="160" cy="216" rx="32" ry="13" fill="' + DK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<path d="M140 216 H182 M150 209 V223 M162 208 V224 M174 209 V223" stroke="#8a6338" stroke-width="2"/></g>' +
    '<ellipse cx="80" cy="236" rx="17" ry="7" fill="' + DK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<ellipse cx="120" cy="236" rx="17" ry="7" fill="' + DK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<ellipse cx="100" cy="158" rx="46" ry="54" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/>' +
    '<ellipse cx="100" cy="170" rx="28" ry="36" fill="' + BELLY + '"/>' +
    '<g class="wL"><path d="M68 128 Q38 150 44 188 Q64 194 72 172 Q80 150 76 134 Z" fill="' + BR + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="55" cy="188" rx="10" ry="7" fill="' + DK + '"/></g>' +
    '<g class="wR"><g transform="translate(200 0) scale(-1 1)"><path d="M68 128 Q38 150 44 188 Q64 194 72 172 Q80 150 76 134 Z" fill="' + BR + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="55" cy="188" rx="10" ry="7" fill="' + DK + '"/></g></g>' +
    '<rect x="64" y="106" width="72" height="16" rx="8" fill="' + RED + '"/>' +
    '<g fill="#fff"><path d="M80 114 l5 -5 l5 5 l-5 5z"/><path d="M97.500 114 l5 -5 l5 5 l-5 5z"/><path d="M115 114 l5 -5 l5 5 l-5 5z"/></g>' +
    '<circle cx="70" cy="46" r="13" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/><circle cx="70" cy="47" r="6" fill="#e9a3a3"/>' +
    '<circle cx="130" cy="46" r="13" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/><circle cx="130" cy="47" r="6" fill="#e9a3a3"/>' +
    '<circle cx="100" cy="76" r="37" fill="' + BR + '" stroke="' + INK + '" stroke-width="3"/>';

  function eye(type, cx, side) {
    var cy = 76, s = 'stroke="' + INK + '" stroke-width="4" stroke-linecap="round" fill="none"';
    if (type === 'happy') return '<path d="M' + (cx - 8) + ' ' + (cy + 4) + ' Q' + cx + ' ' + (cy - 10) + ' ' + (cx + 8) + ' ' + (cy + 4) + '" ' + s + '/>';
    if (type === 'star') return '<text x="' + cx + '" y="' + (cy + 8) + '" text-anchor="middle" font-size="22" fill="#f4b400" stroke="' + INK + '" stroke-width=".8">★</text>';
    var r = type === 'wide' ? 9 : 6.5, dx = 0, dy = 0;
    if (type === 'up') { dx = 2; dy = -3; }
    return '<g class="blink"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>' +
      '<circle cx="' + (cx - 2 + dx) + '" cy="' + (cy - 2.500 + dy) + '" r="2.400" fill="#fff"/></g>';
  }
  function brow(x1, y1, x2, y2) {
    return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + INK + '" stroke-width="3.500" stroke-linecap="round"/>';
  }
  var CHEEK = '<circle cx="68" cy="92" r="7" fill="#ff9fb0" opacity=".7"/><circle cx="132" cy="92" r="7" fill="#ff9fb0" opacity=".7"/>';
  var TEETH = '<rect x="92" y="101" width="16" height="15" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="2.500"/><path d="M100 101 V116" stroke="' + INK + '" stroke-width="2"/>';
  var MOUTH = {
    smile: '<path d="M88 98 Q100 108 112 98" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' + TEETH,
    open: '<path d="M88 97 Q100 126 112 97 Z" fill="#7a1620" stroke="' + INK + '" stroke-width="2.500" stroke-linejoin="round"/>' + TEETH,
    o: '<ellipse cx="100" cy="110" rx="9" ry="10" fill="#7a1620" stroke="' + INK + '" stroke-width="2.500"/>' + TEETH,
    flat: '<path d="M90 100 L110 99" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' + TEETH,
    frown: '<path d="M89 109 Q100 97 111 109" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' + TEETH
  };
  var BEAK = '<ellipse cx="100" cy="97" rx="23" ry="16" fill="' + BELLY + '"/><ellipse cx="100" cy="86" rx="8" ry="5.500" fill="#3b2412"/>';
  var CONF = '';
  [[30, 40, '#ffd166'], [170, 50, '#1f8a4c'], [20, 100, '#c8313e'], [180, 110, '#8fd3f4'], [50, 14, '#c8313e'], [150, 16, '#ffd166']].forEach(function (c) {
    CONF += '<rect x="' + c[0] + '" y="' + c[1] + '" width="9" height="9" rx="2" fill="' + c[2] + '" transform="rotate(' + (c[0] * 3) + ' ' + c[0] + ' ' + c[1] + ')"/>';
  });
  var EXTRA = {
    think: '<g class="extra"><circle cx="160" cy="30" r="20" fill="#fff" stroke="' + INK + '" stroke-width="3"/><text x="160" y="39" text-anchor="middle" font-size="26" font-weight="800" fill="' + RED + '">?</text><circle cx="140" cy="54" r="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/></g>',
    wow: '<g class="extra"><text x="164" y="46" text-anchor="middle" font-size="40" font-weight="800" fill="' + RED + '">!</text></g>',
    sad: '<g class="extra"><path d="M74 88 Q69 99 74 102 Q79 99 74 88Z" fill="#8fd3f4" stroke="' + INK + '" stroke-width="1.500"/></g>',
    joy: '<g class="extra"><text x="28" y="40" font-size="24" fill="#f4b400">✦</text><text x="160" y="56" font-size="18" fill="#f4b400">✦</text></g>',
    cheer: '<g class="extra">' + CONF + '</g>'
  };
  var FACE = {
    hi:    function () { return CHEEK + eye('open', 84) + eye('open', 116) + BEAK + MOUTH.smile; },
    joy:   function () { return CHEEK + eye('happy', 84) + eye('happy', 116) + BEAK + MOUTH.open + EXTRA.joy; },
    wow:   function () { return eye('wide', 84) + eye('wide', 116) + brow(74, 60, 94, 58) + brow(106, 58, 126, 60) + BEAK + MOUTH.o + EXTRA.wow; },
    think: function () { return eye('up', 84) + eye('up', 116) + brow(74, 64, 94, 64) + brow(106, 56, 126, 60) + BEAK + MOUTH.flat + EXTRA.think; },
    sad:   function () { return eye('open', 84) + eye('open', 116) + brow(74, 68, 92, 61) + brow(108, 61, 126, 68) + BEAK + MOUTH.frown + EXTRA.sad; },
    wink:  function () { return CHEEK + eye('happy', 84) + eye('open', 116) + BEAK + MOUTH.smile; },
    cheer: function () { return CHEEK + eye('star', 84) + eye('star', 116) + BEAK + MOUTH.open + EXTRA.cheer; }
  };

  function mkBeaver(emo) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 245');
    svg.setAttribute('class', 'beaver');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Бобр-путеводитель');
    svg.innerHTML = STATIC + '<g class="face"></g>';
    setEmo(svg, emo || 'hi');
    return svg;
  }
  function setEmo(svg, emo) {
    if (!FACE[emo]) emo = 'hi';
    svg.dataset.emo = emo;
    svg.querySelector('.face').innerHTML = FACE[emo]();
  }

  var heroBeaver = mkBeaver('hi'); $('#heroGuide').appendChild(heroBeaver);
  var guideBeaver = mkBeaver('hi'); $('#guideBtn').appendChild(guideBeaver);
  var bubble = $('#bubble');
  var sayTimer;
  function say(text, emo) {
    if (text) { bubble.textContent = text; bubble.style.animation = 'none'; void bubble.offsetWidth; bubble.style.animation = ''; }
    if (emo) { setEmo(guideBeaver, emo); setEmo(heroBeaver, emo); }
  }

  /* legend of emotions */
  var emos = $('#emos');
  Object.keys(EMO_NAMES).forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'emo';
    b.appendChild(mkBeaver(k));
    var sp = document.createElement('span'); sp.textContent = EMO_NAMES[k]; b.appendChild(sp);
    b.onclick = function () { say(PHRASES[k], k); };
    emos.appendChild(b);
  });
  var PHRASES = {
    hi: 'Привет! Я — Бобр, твой проводник!', joy: 'Ура, у нас всё получается!', wow: 'Ого! Вот это новость!',
    think: 'Хм… Давай подумаем вместе.', sad: 'Ошибся? Не страшно — попробуем ещё раз!',
    wink: 'Подскажу секрет: смотри на карту!', cheer: 'Праздник! Ты молодец!'
  };
  $('#moodBtn').onclick = guideClick;
  $('#guideBtn').onclick = guideClick;
  var moodOrder = ['joy', 'wow', 'think', 'wink', 'sad', 'cheer', 'hi'], mi = 0;
  function guideClick() { var k = moodOrder[mi++ % moodOrder.length]; say(PHRASES[k], k); if (k === 'cheer') confetti(); }

  /* ---------- данные курса ---------- */
  var MODS = [
    { icon: '🏡', short: 'Мой дом и семья', title: 'Мой дом и моя семья', emo: 'joy',
      desc: 'Первая остановка. Ребёнок знакомится с понятием «семья», рассказывает о своих близких и правилах дома — отсюда начинается любовь к Родине.',
      subs: [
        { n: 'Герои моей семьи', t: 'И', tool: 'плакат в Genially', d: 'Интерактивный плакат о семье: фото, профессии, традиции.' },
        { n: 'Родословное древо', t: 'П', tool: 'схема / кластер', d: 'Кластер «Моя семья»: ребёнок достраивает ветви и рассказывает по схеме.' },
        { n: 'Правила нашего дома', t: 'К', tool: 'Google Forms', d: 'Короткий тест на понимание обязанностей в семье.' }] },
    { icon: '🏙️', short: 'Мой родной край', title: 'Мой родной город и край', emo: 'wow',
      desc: 'Остановка о малой родине: улица, город или деревня, достопримечательности, люди труда. Учитель добавляет материал о своём регионе.',
      subs: [
        { n: 'Виртуальная прогулка', t: 'И', tool: 'видео, фото', d: 'Видеопрогулка по родному краю с вопросами Бобра.' },
        { n: 'Угадай по признакам', t: 'П', tool: 'PowerPoint', d: 'Игра: Бобр описывает место, дети отгадывают.' },
        { n: 'Проект «Родной город»', t: 'Проект', tool: 'Canva / Padlet', d: 'Рассказ-презентация о любимом месте.' }] },
    { icon: '🚩', short: 'Символы страны', title: 'Государственные символы Беларуси', emo: 'cheer',
      desc: 'Герб, флаг, гимн. Ребёнок узнаёт их, понимает значение и учится относиться с уважением.',
      subs: [
        { n: 'Что рассказывает герб', t: 'И', tool: 'плакат в Genially', d: 'Нажми на часть герба — получи пояснение.' },
        { n: 'Складанка: собери герб', t: 'П', tool: 'LearningApps.org', d: 'Приём «Складанка»: паззл из частей символа.' },
        { n: 'Проверь себя', t: 'К', tool: 'Online Test Pad', d: 'Тест с автопроверкой и звездой за результат.' }] },
    { icon: '🗺️', short: 'Карта Беларуси', title: 'Карта Беларуси: города, реки, природа', emo: 'think',
      desc: 'Остановка о нашей стране: Минск и областные города, реки и озёра, Беловежская пуща и её обитатели.',
      subs: [
        { n: 'Найди город на карте', t: 'П', tool: 'LearningApps.org', d: 'Перетащи названия городов на контурную карту.' },
        { n: 'Реки, озёра, леса', t: 'И', tool: 'видео, энциклопедия', d: 'Краткая теория и «Для любознательных».' },
        { n: 'Лишнее слово', t: 'П', tool: 'PowerPoint', d: 'Исключи лишнее: город — река — животное.' }] },
    { icon: '🎎', short: 'Традиции', title: 'Традиции, праздники, народная культура', emo: 'wink',
      desc: 'Рушник, Купалле, Каляды, Дожинки. Ребёнок узнаёт, как жили предки, и создаёт свой орнамент.',
      subs: [
        { n: 'Календарь праздников', t: 'И', tool: 'Genially', d: 'Интерактивный календарь с рассказами о праздниках.' },
        { n: 'Объединялки', t: 'П', tool: 'Умная игра', d: 'Соедини праздник и его символ или обычай.' },
        { n: 'Мой рушник', t: 'Проект', tool: 'рисунок / Canva', d: 'Создаём орнамент и выставляем в «галерее».' }] },
    { icon: '🏅', short: 'Мы гордимся', title: 'Люди, которыми гордится Беларусь', emo: 'hi',
      desc: 'Знакомство с известными белорусами: писателями, учёными, спортсменами. Что значит быть достойным гражданином.',
      subs: [
        { n: 'Исторические тропинки', t: 'П', tool: 'LearningApps.org', d: 'Соотнеси портрет, дату и достижение.' },
        { n: 'Кто больше?', t: 'П', tool: 'Padlet', d: 'Назови как можно больше слов-понятий о теме.' },
        { n: 'Аукцион понятий', t: 'П', tool: 'групповая игра', d: 'Команды называют и объясняют понятия по теме.' }] },
    { icon: '🤝', short: 'Я — гражданин', title: 'Я — гражданин: права, обязанности, добрые дела', emo: 'cheer',
      desc: 'Главная остановка. Ребёнок узнаёт о своих правах и обязанностях, разбирает ситуации и совершает доброе дело.',
      subs: [
        { n: 'Разбираем ситуации', t: 'П', tool: 'ветвящиеся сюжеты', d: 'Что сделать, если… Выбор поступка и его последствия.' },
        { n: 'Моё доброе дело', t: 'Проект', tool: 'Padlet', d: 'Дети публикуют фото и рассказ о добром деле.' },
        { n: 'Да — Нет', t: 'П', tool: 'Wayground', d: 'Быстрая викторина «верно / неверно».' }] },
    { icon: '🎒', short: 'Копилка Бобра', title: 'Копилка Бобра: словарик, игры, проверь себя', emo: 'joy',
      desc: 'Сводная остановка. Тут всё собрано: обществоведческий словарик, кроссворды, итоговый тест и страница «Для взрослых».',
      subs: [
        { n: 'Словарик понятий', t: 'И', tool: 'Genially', d: 'Слово, картинка и простое объяснение.' },
        { n: 'Кроссворды и ребусы', t: 'П', tool: 'LearningApps.org', d: 'Игры для повторения и закрепления.' },
        { n: 'Итоговый тест', t: 'К', tool: 'Google Forms', d: 'Проверка итогов с автоматической оценкой.' },
        { n: 'Для учителя и родителей', t: 'И', tool: 'страница сайта', d: 'Методика, шаблоны, как наполнить курс.' }] }
  ];
  var TCLS = { 'И': 't-i', 'П': 't-p', 'К': 't-k', 'Проект': 't-c' };
  var TNAME = { 'И': '🔎 Узнаю', 'П': '🎮 Играю', 'К': '✅ Проверяю', 'Проект': '🎨 Создаю' };

  var done = {};
  try { done = JSON.parse(localStorage.getItem('busel-done') || '{}'); } catch (e) { done = {}; }
  function saveDone() { try { localStorage.setItem('busel-done', JSON.stringify(done)); } catch (e) { } }

  /* ---------- карта ---------- */
  var svg = $('#mapSvg'), list = $('#mapList'), panel = $('#panel');
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var COLORS = ['#c8313e', '#1f8a4c', '#f4a300', '#2b8fd1', '#c8313e', '#1f8a4c', '#f4a300', '#2b8fd1'];
  var CX = 480, CY = 310, nodeEls = [], listEls = [], current = -1;
  var gl = el('g', {}, svg), gn = el('g', {}, svg);
  MODS.forEach(function (m, i) {
    var a = (i * 45 - 90) * Math.PI / 180;
    var x = CX + Math.cos(a) * 345, y = CY + Math.sin(a) * 232;
    var mx = (CX + x) / 2 + (y - CY) * 0.12, my = (CY + y) / 2 - (x - CX) * 0.12;
    el('path', { 'class': 'link', d: 'M' + CX + ' ' + CY + ' Q' + mx + ' ' + my + ' ' + x + ' ' + y }, gl);
    var g = el('g', { 'class': 'node', tabindex: 0, role: 'button', 'aria-label': m.title }, gn);
    var inn = el('g', { 'class': 'in' }, g);
    el('rect', { x: x - 90, y: y - 31, width: 180, height: 62, rx: 22, stroke: COLORS[i] }, inn);
    var ic = el('text', { x: x - 72, y: y + 9, 'class': 'ni' }, inn); ic.textContent = m.icon;
    var tx = el('text', { x: x - 36, y: y + 6, 'class': 'nt' }, inn); tx.textContent = m.short;
    var nb = el('text', { x: x - 36, y: y - 12, 'font-size': 11, fill: '#5b6785', 'font-weight': 600 }, inn); nb.textContent = 'Остановка ' + (i + 1);
    var st = el('text', { x: x + 66, y: y - 20, 'class': 'star' }, g); st.textContent = '⭐';
    g.addEventListener('click', function () { select(i, true); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i, true); } });
    nodeEls.push(g);

    var b = document.createElement('button'); b.type = 'button';
    b.innerHTML = '<span class="num">' + (i + 1) + '</span><span>' + m.icon + ' ' + m.short + '</span>';
    b.onclick = function () { select(i, true); };
    list.appendChild(b); listEls.push(b);
  });
  var root = el('g', { 'class': 'root' }, svg);
  el('ellipse', { cx: CX, cy: CY, rx: 118, ry: 58 }, root);
  var r1 = el('text', { x: CX, y: CY - 4 }, root); r1.textContent = 'Мая Радзіма –';
  var r2 = el('text', { x: CX, y: CY + 20 }, root); r2.textContent = 'Беларусь';

  function paintDone() {
    MODS.forEach(function (m, i) {
      nodeEls[i].classList.toggle('done', !!done[i]);
      listEls[i].firstChild.textContent = done[i] ? '⭐' : (i + 1);
    });
  }
  function select(i, scroll) {
    current = i;
    var m = MODS[i];
    nodeEls.forEach(function (n, k) { n.classList.toggle('active', k === i); });
    listEls.forEach(function (n, k) { n.classList.toggle('active', k === i); });
    var h = '<div class="ph"><span class="big">' + m.icon + '</span><div><h3 style="margin:0">Остановка ' + (i + 1) + '. ' + m.title + '</h3>' +
      '<p class="official2">Типовой модуль · наполняется содержанием учебного предмета «Человек и мир»</p></div></div>' +
      '<p>' + m.desc + '</p><p><b>Что на остановке</b> (нажми, чтобы узнать подробнее):</p><ul class="subs">';
    m.subs.forEach(function (s, k) {
      h += '<li><button class="subbtn" type="button" data-k="' + k + '"><span class="tag ' + TCLS[s.t] + '">' + TNAME[s.t] + '</span>' + s.n + '</button></li>';
    });
    h += '</ul><div class="detail" id="detail">Выбери любой пункт — Бобр расскажет, что там происходит.</div>' +
      '<button class="btn small done-btn" type="button" id="doneBtn">' + (done[i] ? '⭐ Остановка пройдена' : 'Отметить остановку пройденной') + '</button>';
    panel.innerHTML = h;
    panel.style.borderLeftColor = COLORS[i];
    panel.querySelectorAll('.subbtn').forEach(function (b) {
      b.onclick = function () {
        panel.querySelectorAll('.subbtn').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var s = m.subs[+b.dataset.k];
        $('#detail').innerHTML = '<b>' + s.n + '.</b> ' + s.d + ' <i>Инструмент: ' + s.tool + '.</i>';
        say(s.t === 'П' ? 'Давай поиграем!' : s.t === 'К' ? 'Проверим, что ты запомнил!' : s.t === 'Проект' ? 'Здесь ты создашь своё!' : 'Сейчас узнаем что-то новое!', s.t === 'П' ? 'joy' : s.t === 'К' ? 'think' : s.t === 'Проект' ? 'wink' : 'wow');
      };
    });
    $('#doneBtn').onclick = function () {
      done[i] = !done[i]; saveDone(); paintDone(); select(i, false);
      var n = Object.keys(done).filter(function (k) { return done[k]; }).length;
      if (done[i]) { say(n === MODS.length ? 'Ты прошёл всю тропу! Настоящий гражданин!' : 'Звезда твоя! Пройдено остановок: ' + n + ' из ' + MODS.length, 'cheer'); confetti(); }
    };
    say('Остановка ' + (i + 1) + ': ' + m.short + '. ' + (m.emo === 'think' ? 'Подумаем!' : 'Отправляемся!'), m.emo);
    if (scroll && window.innerWidth < 900) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  paintDone();
  panel.innerHTML = '<p style="margin:0"><b>👆 Выбери остановку на карте</b> — здесь появится описание модуля, его разделы и инструменты.</p>';

  /* дерево сайта */
  var th = '<ul><li><b>🏠 Главная</b> — герой-путеводитель, начало пути<ul>' +
    '<li>📋 Паспорт курса (аудитория, цели, результаты)</li><li>🎨 Концепция (стиль, Бобр, условные обозначения)</li>' +
    '<li>🗺️ Карта курса<ul>';
  MODS.forEach(function (m, i) {
    th += '<li>' + m.icon + ' ' + (i + 1) + '. ' + m.short + '<ul>';
    m.subs.forEach(function (s) { th += '<li>' + s.n + ' <span class="tag ' + TCLS[s.t] + '">' + s.t + '</span></li>'; });
    th += '</ul></li>';
  });
  th += '</ul></li><li>📚 Планируемое наполнение</li><li>🎮 Мини-игры</li><li>🤝 Гражданственность</li><li>🧰 Инструменты</li></ul></li></ul>';
  $('#tree').innerHTML = th;

  /* ---------- конфетти ---------- */
  function confetti() {
    var cols = ['#c8313e', '#1f8a4c', '#ffd166', '#8fd3f4'];
    for (var i = 0; i < 40; i++) {
      var s = document.createElement('span');
      s.className = 'confetti';
      s.style.left = Math.random() * 100 + 'vw';
      s.style.background = cols[i % 4];
      s.style.animationDelay = Math.random() * .5 + 's';
      document.body.appendChild(s);
      setTimeout((function (n) { return function () { n.remove(); }; })(s), 2600);
    }
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function btn(txt, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (cls ? ' ' + cls : ''); b.textContent = txt; return b; }

  /* ---------- игра 1: лишнее слово ---------- */
  var R1 = [
    { w: ['Герб', 'Флаг', 'Гимн', 'Самокат'], o: 3, why: 'Герб, флаг и гимн — государственные символы.' },
    { w: ['Минск', 'Гродно', 'Брест', 'Варшава'], o: 3, why: 'Варшава — столица Польши, остальные — города Беларуси.' },
    { w: ['Бобр', 'Зубр', 'Лось', 'Пингвин'], o: 3, why: 'Пингвин не живёт в лесах Беларуси.' }
  ];
  var r1i = 0;
  function g1() {
    var r = R1[r1i % R1.length], box = $('#g1o'), fb = $('#g1f');
    $('#g1q').textContent = 'Найди лишнее слово (' + (r1i % R1.length + 1) + ' из ' + R1.length + ')';
    box.innerHTML = ''; fb.textContent = '';
    r.w.forEach(function (w, i) {
      var b = btn(w);
      b.onclick = function () {
        if (i === r.o) {
          b.classList.add('ok'); fb.textContent = '✅ ' + r.why;
          box.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
          say('Верно! Молодец!', 'joy'); r1i++; setTimeout(g1, 2600);
        } else { b.classList.add('bad'); b.disabled = true; fb.textContent = 'Подумай ещё!'; say('Не страшно, попробуй ещё раз!', 'sad'); }
      };
      box.appendChild(b);
    });
  }
  g1();

  /* ---------- игра 2: складанка ---------- */
  var WORDS = ['МИНСК', 'БОБР', 'ФЛАГ', 'БЕЛАРУСЬ', 'РОДИНА'], w2 = 0, pos = 0;
  function g2() {
    var w = WORDS[w2 % WORDS.length]; pos = 0;
    var slots = $('#g2s'), box = $('#g2o');
    slots.innerHTML = ''; box.innerHTML = ''; $('#g2f').textContent = ''; $('#g2n').hidden = true;
    for (var i = 0; i < w.length; i++) slots.appendChild(document.createElement('span'));
    var letters = shuffle(w.split('')); if (letters.join('') === w) letters.reverse();
    letters.forEach(function (ch) {
      var b = btn(ch);
      b.onclick = function () {
        if (ch === w[pos]) {
          slots.children[pos].textContent = ch; b.disabled = true; b.classList.add('ok'); pos++;
          if (pos === w.length) { $('#g2f').textContent = '🎉 Получилось: ' + w + '!'; say('Слово собрано: ' + w + '!', 'cheer'); confetti(); $('#g2n').hidden = false; w2++; }
          else say('Так держать!', 'hi');
        } else { b.classList.add('bad'); say('Эта буква пока не подходит', 'think'); setTimeout(function () { b.classList.remove('bad'); }, 450); }
      };
      box.appendChild(b);
    });
  }
  $('#g2n').onclick = g2; g2();

  /* ---------- игра 3: да / нет ---------- */
  var Q3 = [
    { q: 'Флаг Беларуси красно-зелёный, с орнаментом у древка.', a: true },
    { q: 'Столица Беларуси — Гомель.', a: false },
    { q: 'Бобр строит плотины из веток.', a: true },
    { q: 'Беловежская пуща — дом зубра.', a: true },
    { q: 'Купалле — праздник зимы.', a: false }
  ];
  var q3 = 0, sc3 = 0;
  function g3() {
    var box = $('#g3o'), fb = $('#g3f');
    box.innerHTML = ''; fb.textContent = '';
    if (q3 >= Q3.length) {
      $('#g3q').textContent = 'Игра окончена! Правильных ответов: ' + sc3 + ' из ' + Q3.length;
      var b = btn('Сыграть ещё раз'); b.onclick = function () { q3 = 0; sc3 = 0; $('#g3st').textContent = ''; g3(); }; box.appendChild(b);
      say(sc3 >= 4 ? 'Отлично! Ты знаток Беларуси!' : 'Хорошо! Давай ещё разок?', sc3 >= 4 ? 'cheer' : 'wink'); if (sc3 >= 4) confetti();
      return;
    }
    $('#g3q').textContent = (q3 + 1) + '. ' + Q3[q3].q;
    [['Да', true], ['Нет', false]].forEach(function (p) {
      var b = btn(p[0]);
      b.onclick = function () {
        var ok = p[1] === Q3[q3].a;
        box.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        b.classList.add(ok ? 'ok' : 'bad');
        if (ok) { sc3++; $('#g3st').textContent += '⭐'; say('Верно!', 'joy'); fb.textContent = '✅ Верно!'; }
        else { say('Ничего, в следующий раз получится!', 'sad'); fb.textContent = 'Правильный ответ: ' + (Q3[q3].a ? 'Да' : 'Нет') + '.'; }
        q3++; setTimeout(g3, 1800);
      };
      box.appendChild(b);
    });
  }
  g3();

  /* ---------- навигация, появление, реплики по разделам ---------- */
  $('#burger').onclick = function () {
    var m = $('#menu'), o = m.classList.toggle('open'); this.setAttribute('aria-expanded', o);
  };
  document.querySelectorAll('#menu a').forEach(function (a) { a.onclick = function () { $('#menu').classList.remove('open'); }; });

  var SEC = {
    top: ['Привет! Нажми «Начать путешествие»!', 'hi'],
    map: ['Выбери остановку на карте — расскажу, что там интересного!', 'wink'],
    passport: ['Это паспорт курса: для кого он и чему научит.', 'think'],
    concept: ['А вот я в разных настроениях! Нажми на любое.', 'joy'],
    content: ['Каждая остановка строится по одному шаблону.', 'think'],
    games: ['Поиграем? Я буду за тебя болеть!', 'cheer'],
    citizen: ['Главное — стать добрым и ответственным гражданином!', 'joy'],
    tools: ['Эти сервисы помогут учителю наполнить курс.', 'wink']
  };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && SEC[e.target.id]) say(SEC[e.target.id][0], SEC[e.target.id][1]); });
    }, { threshold: .45 });
    Object.keys(SEC).forEach(function (id) { var n = document.getElementById(id); if (n) so.observe(n); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
  }
})();
