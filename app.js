(function () {
  'use strict';
  var D = DATA, $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var KEY = 'shkatulka-v1';

  /* ---------- состояние (хранится в браузере) ---------- */
  var S = (function () {
    var d = { acorns: 0, tests: {}, games: {}, created: {}, read: {}, badges: {}, day: '', name: '', posts: { club: [], ideas: [] }, forms: {}, marks: [] };
    try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); for (var k in s) d[k] = s[k]; } catch (e) { }
    return d;
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  var ui = {};

  /* ---------- Тимка ---------- */
  var guide = Beaver.make('hi'); $('#guideBtn').appendChild(guide);
  var bubble = $('#bubble');
  var extraGuides = [];
  function say(text, emo) {
    if (text) { bubble.textContent = text; bubble.style.animation = 'none'; void bubble.offsetWidth; bubble.style.animation = ''; }
    if (emo) { Beaver.set(guide, emo); extraGuides.forEach(function (g) { if (g.isConnected) Beaver.set(g, emo); }); }
  }
  var MOODS = [['Привет! Я Тимка, твой проводник по Беларуси!', 'hi'], ['Ура, у нас всё получается!', 'joy'], ['Ого! Вот это новость!', 'wow'], ['Хм… Давай подумаем вместе.', 'think'], ['Ошибся? Не страшно — подсказка рядом!', 'sad'], ['Секрет: за каждый шаг я дарю желуди!', 'wink'], ['Праздник! Ты молодец!', 'cheer']], mi = 0;
  $('#guideBtn').onclick = function () { var m = MOODS[mi++ % MOODS.length]; say(m[0], m[1]); if (m[1] === 'cheer') confetti(); };
  function flip() { var g = $('#guide'); g.classList.add('flip'); setTimeout(function () { g.classList.remove('flip'); }, 1100); }
  var toastT;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function confetti() {
    var cols = ['#d64550', '#2e8b57', '#f6c744', '#3d9bd6'];
    for (var i = 0; i < 36; i++) {
      var s = document.createElement('span'); s.className = 'confetti';
      s.style.left = Math.random() * 100 + 'vw'; s.style.background = cols[i % 4]; s.style.animationDelay = Math.random() * .5 + 's';
      document.body.appendChild(s); setTimeout((function (n) { return function () { n.remove(); }; })(s), 2600);
    }
  }

  /* ---------- желуди, уровни, бейджи ---------- */
  function levelIdx(a) { var k = 0; D.LEVELS.forEach(function (l, i) { if (a >= l.min) k = i; }); return k; }
  function hud() {
    var a = S.acorns, i = levelIdx(a), cur = D.LEVELS[i], nx = D.LEVELS[i + 1];
    var pct = nx ? Math.round((a - cur.min) / (nx.min - cur.min) * 100) : 100;
    $('#hud').innerHTML = '<span class="av">🦫</span><b>🌰 ' + a + '</b><span class="lvwrap"><span class="lv">' + cur.n + '</span><div class="bar"><i style="width:' + pct + '%"></i></div></span>';
  }
  function earn(n, why) {
    var before = levelIdx(S.acorns); S.acorns += n; var after = levelIdx(S.acorns);
    save(); hud(); toast('+' + n + ' 🌰 ' + why + '! Отличная работа!'); say('+' + n + ' желудей! Так держать!', 'joy');
    if (after > before) { say('Ура! Ты теперь «' + D.LEVELS[after].n + '»! Загляни в рюкзак — там новый бейдж!', 'cheer'); flip(); confetti(); }
    checkBadges();
  }
  function bestErr(n) { var t = S.tests[n]; return t ? t.bestErr : 99; }
  function allDone(pred) { return [1, 2, 3, 4, 5].every(pred); }
  var BCOND = {
    map: function () { return !!(S.tests[1] && S.games.g1 && S.created[1]); },
    forest: function () { return bestErr(2) === 0 && bestErr(3) === 0; },
    rivers: function () { return bestErr(4) === 0; },
    eco: function () { return allDone(function (n) { return !!S.created[n]; }); },
    why: function () { return [0, 1, 2].every(function (i) { return !!S.read['x' + i]; }); },
    gamer: function () { return ['g1', 'g2', 'g3', 'g4', 'g5'].every(function (g) { return !!S.games[g]; }); }
  };
  function checkBadges() {
    D.BADGES.forEach(function (b) {
      if (!S.badges[b.id] && BCOND[b.id]()) { S.badges[b.id] = true; save(); toast('🏅 Новый бейдж: «' + b.n + '»!'); say('Новый бейдж «' + b.n + '»! Он уже в рюкзаке.', 'cheer'); confetti(); }
    });
  }
  function win(gid) {
    confetti();
    if (!S.games[gid]) { S.games[gid] = true; save(); earn(3, 'за победу в игре'); } else toast('Победа! Желуди за эту игру уже получены.');
  }
  var today = new Date().toISOString().slice(0, 10);
  window.App = { say: say, win: win };

  /* ---------- вспомогательные куски ---------- */
  function tabsHTML(key, items, def) {
    var cur = ui[key] || def || items[0][0];
    return '<div class="tabs" role="tablist">' + items.map(function (t) {
      return '<button class="tab' + (t[0] === cur ? ' on' : '') + '" role="tab" data-act="tab" data-k="' + key + '" data-t="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div>';
  }
  function curTab(key, items) { return ui[key] || items[0][0]; }
  function head(crumb, title, lead) {
    return '<p class="crumbs"><a href="#home">← На карту</a>' + (crumb ? ' · ' + crumb : '') + '</p><h2>' + title + '</h2>' + (lead ? '<p class="lead">' + lead + '</p>' : '');
  }
  function formHTML(id, qs, note) {
    var h = '<form data-form="' + id + '">';
    qs.forEach(function (q, i) {
      h += '<div class="formq"><b>' + (i + 1) + '. ' + q.q + '</b>';
      if (q.o) h += q.o.map(function (o) { return '<label><input type="radio" name="q' + i + '" value="' + esc(o) + '"> ' + o + '</label>'; }).join('');
      if (q.text) h += '<textarea name="t' + i + '" placeholder="' + (q.o ? 'Если нужно, опишите…' : 'Ваш ответ') + '"></textarea>';
      h += '</div>';
    });
    return h + '<button class="btn primary" type="submit">Отправить</button> <span class="fb" id="ff-' + id + '">' + (S.forms[id] ? '✅ Ваш ответ сохранён на этом устройстве.' : '') + '</span>' +
      '<p class="small">' + (note || 'Учебный прототип: ответы сохраняются только в вашем браузере.') + '</p></form>';
  }
  function boardHTML(key, ph) {
    var h = '<form data-board="' + key + '"><textarea name="m" placeholder="' + ph + '" required></textarea><p><button class="btn primary small" type="submit">Опубликовать</button></p></form>';
    (S.posts[key] || []).slice().reverse().forEach(function (p) { h += '<div class="post">' + esc(p.t) + '<br><small>' + esc(p.d) + '</small></div>'; });
    return h;
  }
  function stopDone(n) { return !!S.tests[n]; }
  var post = [];

  /* ---------- ГЛАВНАЯ ---------- */
  function flagsSVG() {
    var pos = { 1: [275, 225, 'Равнины'], 2: [105, 305, 'Лес'], 3: [375, 335, 'Богатства леса'], 4: [485, 205, 'Реки'], 5: [225, 130, 'Озёра'] };
    return D.STOPS.map(function (s) {
      var p = pos[s.id];
      return '<g class="flag' + (stopDone(s.id) ? ' done' : '') + '" data-go="stop-' + s.id + '" transform="translate(' + p[0] + ' ' + p[1] + ')" tabindex="0" role="link" aria-label="Остановка ' + s.id + ': ' + s.title + '">' +
        '<rect class="hit" x="-30" y="-56" width="110" height="88"/><line class="pole" x1="0" y1="0" x2="0" y2="-50"/>' +
        '<path class="cloth" d="M2 -50 h40 q4 0 4 4 v16 q0 4 -4 4 h-40z" fill="' + s.color + '" stroke="#fff" stroke-width="2"/>' +
        '<text class="num" x="24" y="-33">' + s.id + '</text><text class="lab" x="0" y="20">' + p[2] + '</text><text class="badge" x="-14" y="-52" font-size="20">⭐</text></g>';
    }).join('');
  }
  function homeView() {
    var n = [1, 2, 3, 4, 5].filter(stopDone).length;
    var h = '<section class="hero"><div class="cloud c1"></div><div class="cloud c2"></div><div class="wrap">' +
      '<span class="kicker">Электронный курс · Человек и мир · 3 класс</span>' +
      '<h1>Белорусская Шкатулка: <span>Тайны родной земли</span></h1>' +
      '<p class="lead">Привет! Меня зовут Тимка, я бобёр-краевед. Вместе пройдём 5 остановок на карте, откроем тайны равнин, лесов, рек и озёр, поиграем и заработаем желуди 🌰. А ты знаешь, почему на карте Беларусь зелёная и жёлтая? Давай разберёмся вместе!</p>' +
      '<div class="mapwrap">' + Beaver.mapSVG(flagsSVG()) + '<div class="mapguide" id="mapGuide"></div></div>' +
      '<div class="legend"><span><i style="background:#bfe8c8"></i>низины</span><span><i style="background:#f9e29a"></i>возвышенности</span><span><i style="background:#59b4ea"></i>реки и озёра</span><span>🚩 нажми на флажок — отправимся на остановку</span></div></div></section>' +
      '<div class="wrap page"><h2>5 остановок</h2><p class="muted">Пройдено остановок: <b>' + n + ' из 5</b></p><div class="grid g5">';
    D.STOPS.forEach(function (s) {
      h += '<a class="card stopcard" href="#stop-' + s.id + '" style="border-top-color:' + s.color + '"><span class="st">' + (stopDone(s.id) ? '⭐' : '') + '</span><div class="ico">' + s.icon + '</div><h3>' + s.id + '. ' + s.title + '</h3><p class="small">' + s.theme + '</p></a>';
    });
    h += '</div><div class="sect grid g2">' +
      '<a class="card y" href="#games"><h3>🎮 Игровая поляна Тимки</h3><p>Онлайн-игры и игры без компьютера для перемены и дома.</p></a>' +
      '<a class="card b" href="#library"><h3>📚 Секретная библиотека</h3><p>Шпаргалки, редкие факты, словари, кинозал и мастерская.</p></a>' +
      '<a class="card br" href="#backpack"><h3>🎒 Рюкзак достижений</h3><p>Желуди, уровни и бейджи. Сейчас у тебя <b>' + S.acorns + ' 🌰</b>.</p></a>' +
      '<a class="card" href="#diploma"><h3>🎓 Диплом Юного Краеведа</h3><p>' + (n === 5 ? 'Все остановки пройдены — забирай диплом!' : 'Пройди все 5 остановок, и Тимка вручит диплом.') + '</p></a></div>' +
      '<div class="sect grid g2"><a class="card y" href="#parents"><h3>👪 Штаб заботливых родителей</h3><p>Как помочь ребёнку, дневник путешественника, анкета.</p></a>' +
      '<a class="card" href="#teachers"><h3>🍄 Методическая поляна для учителей</h3><p>Планирование, интерактивы, обмен опытом.</p></a></div></div>';
    post.push(function () { var g = Beaver.make('hi'); extraGuides.push(g); $('#mapGuide').appendChild(g); });
    return h;
  }

  /* ---------- ОСТАНОВКА ---------- */
  var TABS = [['warm', '🔥 Разминка'], ['know', '💡 Узнаю'], ['play', '🎮 Играю'], ['make', '🎨 Создаю'], ['test', '✅ Проверяю']];
  var T = null;
  function stopView(n) {
    var s = D.STOPS[n - 1], key = 'stop' + n, tab = curTab(key, TABS);
    var h = '<div class="wrap page">' + head('Остановка ' + n + ' из 5', s.icon + ' Остановка ' + n + '. «' + s.title + '»', '<b>Тема:</b> ' + s.theme + '. ' + s.intro) + tabsHTML(key, TABS) + '<div class="pane">';
    if (tab === 'warm') {
      h += '<h3>Разминка (ситуационная задача)</h3><div class="callout"><b>Тимка спрашивает:</b><br>' + s.warm + '</div><textarea id="warmTxt" placeholder="Напиши свой ответ"></textarea><p><button class="btn primary" data-act="warm" type="button">Я ответил(а)</button> <span class="fb" id="warmFb"></span></p>';
    } else if (tab === 'know') {
      h += '<h3>Интересные факты</h3><div class="facts">' + s.facts.map(function (f) { return '<div class="fact">' + f + '</div>'; }).join('') + '</div><p class="small">Больше материалов — в <a href="#library">Секретной библиотеке</a>.</p>';
    } else if (tab === 'play') {
      h += '<h3>Играю</h3><p><b>Что можно сделать на этой остановке:</b></p><ul>' + s.play.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
        '<h3>Сыграй прямо здесь' + (S.games[s.game] ? ' ✅' : '') + '</h3><div class="gwrap" id="gbox"></div>';
      post.push(function () { Games.mount(s.game, $('#gbox')); });
    } else if (tab === 'make') {
      h += '<h3>Создаю: «' + s.create.title + '»</h3><div class="callout g">' + s.create.text + '</div>' +
        '<p><label class="btn small warn" style="cursor:pointer">📷 Выбрать фото или рисунок<input type="file" accept="image/*" id="photoIn" hidden></label></p><img id="photoPrev" class="photo" alt="" hidden>' +
        '<p><textarea id="mkTxt" placeholder="Расскажи о своей работе"></textarea></p>' +
        '<p><button class="btn primary" data-act="make" data-n="' + n + '" type="button"' + (S.created[n] ? ' disabled' : '') + '>' + (S.created[n] ? '✅ Работа сохранена' : 'Сохранить работу (+15 🌰)') + '</button></p>' +
        '<p class="small">Учебный прототип: фото не отправляется на сервер, оно остаётся только на вашем устройстве.</p>';
    } else {
      h += '<h3>Проверяю' + (s.final ? ': итоговый тест' : '') + '</h3><div id="tbox"></div>';
      post.push(function () { T = null; testIntro(n); });
    }
    h += '</div><p style="margin-top:20px">' + (n > 1 ? '<a class="btn small" href="#stop-' + (n - 1) + '">← Остановка ' + (n - 1) + '</a> ' : '') + (n < 5 ? '<a class="btn small primary" href="#stop-' + (n + 1) + '">Остановка ' + (n + 1) + ' →</a>' : '<a class="btn small primary" href="#diploma">К диплому →</a>') + '</p></div>';
    return h;
  }

  /* ---------- тест ---------- */
  function norm(x) { return x.toLowerCase().replace(/ё/g, 'е'); }
  function okOpen(q, v) {
    v = norm(v).trim();
    if (q.free) return v.length >= 3;
    var kw = q.kw;
    if (Array.isArray(kw[0])) return kw.every(function (g) { return g.some(function (k) { return v.indexOf(norm(k)) > -1; }); });
    return kw.some(function (k) { return v.indexOf(norm(k)) > -1; });
  }
  function testIntro(n) {
    var t = S.tests[n], box = $('#tbox');
    box.innerHTML = '<div class="callout b">Тест из 10 вопросов. За ответы без ошибок — 10 🌰, с 1–2 ошибками — 5 🌰.' + (t ? '<br>Твой лучший результат: ошибок — <b>' + t.bestErr + '</b>.' : '') + '</div><button class="btn primary" id="tstart" type="button">' + (t ? 'Пройти ещё раз' : 'Начать тест') + '</button>';
    $('#tstart').onclick = function () { T = { n: n, i: 0, err: 0, wrong: [] }; testQ(); say('Давай проверим, что ты запомнил!', 'think'); };
  }
  function testQ() {
    var s = D.STOPS[T.n - 1], q = s.test[T.i], box = $('#tbox');
    var h = '<div class="progress"><i style="width:' + (T.i / 10 * 100) + '%"></i></div><div class="qbox"><div class="qn">Вопрос ' + (T.i + 1) + ' из 10 · ' + (q.t === 'c' ? 'выбери ответ' : 'напиши ответ') + '</div><div class="qtext">' + q.q + '</div>';
    if (q.t === 'c') {
      h += '<div class="opts">' + q.o.map(function (o, k) { return '<button class="opt" type="button" data-k="' + k + '">' + 'АБВ'[k] + ') ' + o + '</button>'; }).join('') + '</div>';
    } else h += '<input type="text" id="oans" placeholder="Твой ответ" autocomplete="off"><p><button class="btn primary small" id="osend" type="button">Ответить</button></p>';
    box.innerHTML = h + '<p class="fb" id="tfb"></p><p><button class="btn primary small" id="tnext" type="button" hidden>' + (T.i === 9 ? 'Узнать результат' : 'Дальше →') + '</button></p></div>';
    function after(ok, msg) {
      if (!ok) { T.err++; T.wrong.push(T.i); }
      $('#tfb').innerHTML = (ok ? '✅ Верно! ' : '❌ ') + msg;
      say(ok ? 'Верно! Молодец!' : 'Ничего, в следующий раз получится!', ok ? 'joy' : 'sad');
      $('#tnext').hidden = false;
    }
    if (q.t === 'c') {
      box.querySelectorAll('.opt').forEach(function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, ok = k === q.a;
          box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
          b.classList.add(ok ? 'ok' : 'bad'); if (!ok) box.querySelectorAll('.opt')[q.a].classList.add('ok');
          after(ok, ok ? '' : 'Правильный ответ: ' + q.o[q.a] + '.');
        };
      });
    } else {
      $('#osend').onclick = function () {
        var v = $('#oans').value; if (!v.trim()) { toast('Напиши ответ'); return; }
        $('#oans').disabled = true; $('#osend').hidden = true;
        var ok = okOpen(q, v); after(ok, q.free ? 'Пример ответа: ' + q.ans + '.' : (ok ? '' : 'Правильный ответ: ' + q.ans + '.'));
      };
      $('#oans').onkeydown = function (e) { if (e.key === 'Enter') $('#osend').click(); };
    }
    $('#tnext').onclick = function () { T.i++; if (T.i < 10) testQ(); else testEnd(); };
  }
  function testEnd() {
    var n = T.n, err = T.err, reward = err === 0 ? 10 : err <= 2 ? 5 : 0, prev = S.tests[n];
    var gain = Math.max(0, reward - (prev ? prev.reward : 0));
    S.tests[n] = { bestErr: Math.min(err, prev ? prev.bestErr : 99), reward: Math.max(reward, prev ? prev.reward : 0), wrong: T.wrong.slice() };
    save(); hud();
    var box = $('#tbox'), emo = err === 0 ? 'cheer' : err <= 2 ? 'joy' : 'wink';
    box.innerHTML = '<div class="result"><div class="big">' + (err === 0 ? '🏆' : err <= 2 ? '🌟' : '🌱') + '</div><h3>Ошибок: ' + err + ' из 10</h3><p>' +
      (err === 0 ? 'Блестяще! Все ответы верные.' : err <= 2 ? 'Отличный результат!' : 'Хорошая попытка! Загляни в «Узнаю» и попробуй ещё раз.') + '</p>' +
      '<p>' + (reward ? 'За тест: <b>' + reward + ' 🌰</b>' : 'Желуди даются за тест с 0–2 ошибками.') + (gain < reward && reward ? ' (уже получено ранее: ' + (reward - gain) + ')' : '') + '</p>' +
      '<button class="btn" id="tagain" type="button">Пройти ещё раз</button> ' + (n < 5 ? '<a class="btn primary" href="#stop-' + (n + 1) + '">Следующая остановка →</a>' : '<a class="btn primary" href="#diploma">К диплому →</a>') + '</div>';
    $('#tagain').onclick = function () { T = { n: n, i: 0, err: 0, wrong: [] }; testQ(); };
    say(err <= 2 ? 'Отлично! Остановка пройдена!' : 'Ничего, давай повторим!', emo); if (err <= 2) confetti();
    if (gain) earn(gain, 'за тест'); else checkBadges();
    if (n === 5 && [1, 2, 3, 4, 5].every(stopDone)) toast('🎓 Все остановки пройдены! Забирай диплом.');
  }

  /* ---------- ИГРОВАЯ ПОЛЯНА ---------- */
  function gamesView() {
    var items = [['on', '🕹️ Играю за компьютером'], ['off', '⚽ Играю без компьютера']], tab = curTab('games', items);
    var h = '<div class="wrap page">' + head('', '🎮 Игровая поляна Бобра Тимки', 'За победу в онлайн-игре дети получают 3 🌰, а за победу во всех пяти играх — бейдж «Игроман».') + tabsHTML('games', items) + '<div class="pane">';
    if (tab === 'on') {
      D.GAMES.forEach(function (g, i) {
        var open = ui.gopen === g.id;
        h += '<div class="card ' + (i % 2 ? 'b' : 'y') + '" style="margin-bottom:16px"><h3>' + (i + 1) + '. «' + g.n + '» ' + (S.games[g.id] ? '✅' : '') + '</h3><p class="small">Тема: ' + g.theme + ' · в учебной версии: ' + g.tool + '</p><p>' + g.d + '</p>' +
          '<button class="btn small ' + (open ? '' : 'primary') + '" data-act="gopen" data-g="' + g.id + '" type="button">' + (open ? 'Закрыть' : 'Играть') + '</button>' + (open ? '<div class="gwrap" id="gbox" style="margin-top:12px"></div>' : '') + '</div>';
        if (open) post.push(function () { Games.mount(g.id, $('#gbox')); });
      });
    } else {
      D.OFFLINE.forEach(function (g, i) {
        h += '<div class="card ' + (i % 2 ? 'b' : 'y') + '" style="margin-bottom:16px"><h3>' + (i + 1) + '. ' + g.n + '</h3><p class="small"><b>Что нужно:</b> ' + g.need + '</p><p>' + g.d + '</p></div>';
      });
      h += '<p class="small">Файлы для печати (игровое поле, карточки мемори) готовятся — их добавит автор курса.</p>';
    }
    return h + '</div></div>';
  }

  /* ---------- СЕКРЕТНАЯ БИБЛИОТЕКА ---------- */
  var LT = [['cards', '📇 Шпаргалки Тимки'], ['extra', '🔍 Любознательным'], ['chest', '🧰 Волшебный сундук'], ['cinema', '🎬 Кинозал'], ['work', '🛠️ Мастерская']];
  function libraryView() {
    var tab = curTab('lib', LT), h = '<div class="wrap page">' + head('', '📚 Секретная библиотека Бобра Тимки', 'Здесь Тимка хранит важные записи, карты и волшебные инструменты для собственных проектов.') + tabsHTML('lib', LT) + '<div class="pane">';
    if (tab === 'cards') {
      h += '<h3>Короткие карточки по темам</h3><div class="grid g2">' +
        '<div class="card"><h3>1. Равнины</h3><p>🟩 Зелёный цвет — низины.<br>🟨 Жёлтый цвет — возвышенности.<br>⛰️ Главная вершина — гора Дзержинская (345 м).</p></div>' +
        '<div class="card"><h3>2. Леса: «этажи леса»</h3><p>1-й: сосны, дубы<br>2-й: рябина<br>3-й: кустарники<br>4-й: травы<br>5-й: мхи</p></div>' +
        '<div class="card b"><h3>3. Вода</h3><p style="font-size:1.15rem"><b>Исток ➡️ Русло ➡️ Устье</b></p><p>Главные реки: Днепр, Березина, Припять.</p></div>' +
        '<div class="card y"><h3>4. Лесные богатства</h3><p>Правила поведения в лесу. Мусор разлагается долго: пластик — около 200 лет, стекло — более 30 лет.</p></div></div>';
    } else if (tab === 'extra') {
      var ex = [['🏆 Рекорды Беларуси', 'Самое старое дерево — дуб-патриарх в Брестской области, ему более 800 лет. Самое глубокое озеро — Долгое (53 м). Самая длинная река — Днепр.'], ['🦬 Необычные обитатели', 'Рассказ о животных из Красной книги Беларуси: о зубрах — символах страны, о болотных черепахах.'], ['❓ Почемучки от Бобра', 'Почему в лесу дышится легко? Почему реки не заканчиваются, если в них впадают другие реки?']];
      h += '<h3>Любознательным на заметку</h3><p class="small">Отмечай галочкой то, что прочитал, — так открывается бейдж «Почемучка».</p>';
      ex.forEach(function (e, i) {
        h += '<div class="card ' + (i % 2 ? 'b' : 'y') + '" style="margin-bottom:14px"><h3>' + e[0] + '</h3><p>' + e[1] + '</p><label><input type="checkbox" data-act="read" data-i="' + i + '"' + (S.read['x' + i] ? ' checked' : '') + '> Я прочитал(а)</label></div>';
      });
    } else if (tab === 'chest') {
      h += '<h3>Волшебный сундук: проверенные источники</h3><ul class="ul-clean">' +
        '<li>📖 <b>Словари:</b> детский толковый словарь (слова «русло», «природное сообщество» и другие). Ссылку добавит учитель.</li>' +
        '<li>🌍 <b>Энциклопедии:</b> детские разделы <a href="https://www.nlb.by" target="_blank" rel="noopener">Национальной библиотеки Беларуси</a>, детские энциклопедии о природе и животных.</li>' +
        '<li>🗺️ <b>Справочники:</b> интерактивная физическая карта Беларуси с названиями рек и городов.</li></ul><p class="small">Только проверенные безопасные ресурсы. Если не уверен — спроси у взрослых.</p>';
    } else if (tab === 'cinema') {
      h += '<h3>Кинозал Тимки (видео по 1–3 минуты)</h3><p class="small">Видео встраиваются прямо в сайт, чтобы ребёнок не уходил на сторонние каналы.</p><div class="grid g3">' +
        ['Путешествие капельки воды (круговорот воды и реки)', 'Животные белорусских лесов', 'Как появляются горы и равнины'].map(function (t) {
          return '<div class="card b"><div style="background:#24324d;color:#fff;border-radius:12px;aspect-ratio:16/9;display:grid;place-items:center;font-size:2.4rem">▶</div><h3 style="margin-top:10px;font-size:1rem">' + t + '</h3><p class="small">Видео будет добавлено автором курса.</p></div>';
        }).join('') + '</div>';
    } else {
      h += '<h3>Мастерская Тимки: делаем свои СИМ</h3><div class="callout g"><b>Интерактивные плакаты (Genially).</b> Тимка даёт готовые шаблоны. Например, нажимаешь на «Этажи леса» — появляется картинка животного, которое там живёт. Нужно только вписать свои факты и картинки.</div>' +
        '<h3>«Мой маршрут»</h3><p>Нажми на карту, чтобы поставить метку: где ты живёшь и какие природные объекты рядом.</p><div class="mapwrap" id="myMap">' + Beaver.mapSVG('<g id="pins"></g>') + '</div><p><button class="btn small" data-act="clearpins" type="button">Убрать метки</button></p>';
      post.push(function () {
        var svg = $('#myMap svg'), pins = $('#pins');
        function draw() { pins.innerHTML = S.marks.map(function (m) { return '<text x="' + (m[0] - 11) + '" y="' + m[1] + '" font-size="26">📍</text>'; }).join(''); }
        draw();
        svg.onclick = function (e) {
          var r = svg.getBoundingClientRect(); S.marks.push([Math.round((e.clientX - r.left) / r.width * 620), Math.round((e.clientY - r.top) / r.height * 500)]);
          save(); draw(); say('Метка поставлена! Здесь твой край.', 'wink');
        };
        window.__redraw = draw;
      });
    }
    return h + '</div></div>';
  }

  /* ---------- РОДИТЕЛЯМ ---------- */
  var PT = [['rec', '💡 Тимка рекомендует'], ['hw', '📊 Проверка ДЗ'], ['poll', '📝 Анкета'], ['fam', '🌳 Семейные задания'], ['dic', '📖 Шпаргалка']];
  function parentsView() {
    var tab = curTab('par', PT), h = '<div class="wrap page">' + head('', '👪 Штаб заботливых родителей', 'Уютная полянка у реки. Бобёр Тимка здесь главный консультант и помощник.') + tabsHTML('par', PT) + '<div class="pane">';
    if (tab === 'rec') {
      h += '<h3>Что мы изучаем?</h3><p>Курс «Человек и мир» за 3 класс, 5 остановок: равнины, леса и их обитатели, значение леса, реки, озёра.</p><ol>' + D.STOPS.map(function (s) { return '<li><b>' + s.title + '</b> — ' + s.theme + '</li>'; }).join('') + '</ol>' +
        '<h3>Советы от Бобра</h3><div class="callout">«Не заставляйте ребёнка заучивать параграф наизусть. Лучше вместе найдите на физической карте самую высокую точку или посмотрите в окно, на каком ярусе (этаже) растут деревья у вас во дворе».</div>' +
        '<h3>Правила безопасного интернета</h3><ul><li>Для третьеклассника достаточно 20–30 минут за компьютером подряд, затем перерыв.</li><li>Ребёнок не вводит на сайте адрес, телефон и другие личные данные.</li><li>На сайте нет внешних рекламных ссылок, видео встроены.</li></ul>';
    } else if (tab === 'hw') {
      h += '<h3>Дневник путешественника (на этом устройстве)</h3><div class="tw"><table><tr><th>Остановка</th><th>Тест</th><th>Игра</th><th>Творчество</th></tr>' +
        D.STOPS.map(function (s) {
          var t = S.tests[s.id];
          return '<tr><td>' + s.id + '. ' + s.title + '</td><td>' + (t ? 'ошибок: ' + t.bestErr : '—') + '</td><td>' + (S.games[s.game] ? '✅' : '—') + '</td><td>' + (S.created[s.id] ? '✅' : '—') + '</td></tr>';
        }).join('') + '</table></div><p>Желудей собрано: <b>' + S.acorns + ' 🌰</b>, уровень: <b>' + D.LEVELS[levelIdx(S.acorns)].n + '</b>.</p>' +
        '<h3>Разбор ошибок</h3>';
      var any = false;
      D.STOPS.forEach(function (s) {
        var t = S.tests[s.id]; if (!t || !t.wrong.length) return; any = true;
        h += '<div class="callout b"><b>' + s.title + '</b> (' + s.theme + '). Стоит повторить:<ul>' + t.wrong.map(function (i) { return '<li>' + s.test[i].q + '</li>'; }).join('') + '</ul><i>Тимка: «Давайте вместе нарисуем это в альбоме!»</i></div>';
      });
      if (!any) h += '<p class="muted">Пока ошибок нет — или ребёнок ещё не проходил тесты на этом устройстве.</p>';
      h += '<p class="small">Учебный прототип: личного кабинета с логином пока нет, данные берутся из браузера этого устройства.</p>';
    } else if (tab === 'poll') {
      h += '<h3>Оцените наш сайт</h3>' + formHTML('parents', [
        { q: 'Удобно ли вашему ребёнку ориентироваться на сайте?', o: ['Да', 'Нет', 'Затрудняюсь ответить'] },
        { q: 'Какая рубрика нравится вашему ребёнку больше всего?', o: ['Разминка', 'Узнаю', 'Играю', 'Создаю', 'Проверяю'] },
        { q: 'Возникали ли трудности при выполнении творческих заданий (рубрика «Создаю»)?', o: ['Да', 'Нет'], text: 1 },
        { q: 'Оцените бобра Тимку по 5-балльной шкале (1 — не понравился, 5 — в восторге!)', o: ['1', '2', '3', '4', '5'] },
        { q: 'Какой темы, на ваш взгляд, не хватает на сайте?', text: 1 }]) +
        '<h3>Книга жалоб и предложений Тимки</h3><form data-board="parentbook"><textarea name="m" placeholder="Отзыв, ошибка на сайте или идея для новой игры" required></textarea><p><button class="btn small primary" type="submit">Отправить</button></p></form>';
    } else if (tab === 'fam') {
      h += '<h3>Выходные с Тимкой</h3><div class="callout">«Сходите всей семьёй в лесопарк. Найдите три разных дерева и определите, к какому ярусу они относятся. Сделайте фото и загрузите в наш „Альбом путешественников“».</div><h3>Семейный кроссворд</h3><p>Раз в месяц публикуется кроссворд по пройденным темам, который интересно разгадывать всей семьёй вечером. <span class="pill p-y">скоро</span></p>';
    } else {
      h += '<h3>Мини-словарик для родителей</h3><p class="small">Чтобы быстро объяснить ребёнку сложные слова из учебника.</p><ul class="ul-clean">' + D.TERMS.map(function (t) { return '<li><b>' + t[0] + '.</b> ' + t[1] + '</li>'; }).join('') + '</ul>';
    }
    return h + '</div></div>';
  }

  /* ---------- УЧИТЕЛЯМ ---------- */
  var UT = [['bank', '🍂 Педагогическая копилка'], ['dig', '💻 Цифровые помощники'], ['club', '💬 Обмен опытом'], ['poll', '📝 Анкета']];
  function teachersView() {
    var tab = curTab('tea', UT), h = '<div class="wrap page">' + head('', '🍄 Методическая поляна', 'Сдержанный дизайн в фирменных цветах сайта: зелёный, жёлтый, голубой.') + tabsHTML('tea', UT) + '<div class="pane">';
    if (tab === 'bank') {
      h += '<h3>Календарно-тематическое планирование (структура)</h3><p class="small">Сетка из 5 остановок. Количество часов определяет учитель.</p><div class="tw"><table><tr><th>№</th><th>Тема</th><th>Этапы урока</th><th>Интерактив</th></tr>' +
        D.STOPS.map(function (s) { return '<tr><td>' + s.id + '</td><td><a href="#stop-' + s.id + '">' + s.title + '</a><br><small>' + s.theme + '</small></td><td>Разминка → Узнаю → Играю → Создаю → Проверяю → рефлексия</td><td>' + (D.GAMES.filter(function (g) { return g.id === s.game; })[0] || { n: 'Река или озеро?' }).n + '</td></tr>'; }).join('') + '</table></div>' +
        '<h3>Планы-конспекты (технологические карты)</h3><p>К каждой остановке — конспект с целями, задачами и этапами урока, включая рефлексию. <span class="pill p-y">готовится</span></p>' +
        '<h3>Дидактические материалы</h3><ul><li>Карточки для индивидуальной работы («Подпиши части реки») <span class="pill p-y">скоро</span></li><li>Тексты для проверки техники чтения на краеведческом материале <span class="pill p-y">скоро</span></li><li>Шаблоны для интерактивных тетрадей (лэпбуков) <span class="pill p-y">скоро</span></li></ul>';
    } else if (tab === 'dig') {
      var base = location.origin + location.pathname.replace(/index\.html$/, '');
      h += '<h3>База интерактивов</h3><p>Игры раздела «Игровая поляна» работают на сайте, а их внешние аналоги (LearningApps, Wordwall, Educaplay, Quizizz, Genially) учитель может создать и скопировать для редактирования.</p><h3>Ссылки для QR-кодов</h3><p class="small">Вставьте ссылку в любой генератор QR-кодов и покажите детям на уроке.</p><ul class="ul-clean">' +
        D.STOPS.map(function (s) { return '<li>Остановка ' + s.id + ': <code>' + base + '#stop-' + s.id + '</code></li>'; }).join('') + '<li>Игровая поляна: <code>' + base + '#games</code></li></ul>';
    } else if (tab === 'club') {
      h += '<h3>Клуб Тимки</h3><p>Задайте вопрос коллегам: «Как вы объясняете понятие „возвышенность“ в сельской школе?»</p>' + boardHTML('club', 'Ваш вопрос или ответ коллегам') +
        '<h3>Банк идей</h3><p>Например: «Разминка в начале урока в виде игры „Найди лишнее на карте“».</p>' + boardHTML('ideas', 'Поделитесь находкой') +
        '<p class="small">Учебный прототип: сообщения видны только на этом устройстве.</p>';
    } else {
      h += '<h3>Оцените методическую поддержку</h3>' + formHTML('teachers', [
        { q: 'Достаточно ли методических материалов для подготовки к уроку?', o: ['Да', 'Частично', 'Нет'] },
        { q: 'Какие рубрики детского сайта наиболее эффективны на уроке?', o: ['Разминка', 'Играю', 'Создаю', 'Проверяю'] },
        { q: 'Возникают ли технические сложности при использовании сайта на интерактивной доске?', o: ['Да', 'Нет'], text: 1 },
        { q: 'Какой темы, на ваш взгляд, не хватает для полного раскрытия раздела «Мой родной край»?', text: 1 },
        { q: 'Предложите идею для новой интерактивной игры.', text: 1 }]);
    }
    return h + '</div></div>';
  }

  /* ---------- РЮКЗАК И ДИПЛОМ ---------- */
  function backpackView() {
    var a = S.acorns, i = levelIdx(a), cur = D.LEVELS[i], nx = D.LEVELS[i + 1];
    var h = '<div class="wrap page">' + head('', '🎒 Рюкзак достижений Тимки', 'За любую активность на сайте ты получаешь желуди 🌰 — любимую еду Тимки.') +
      '<div class="grid g2"><div class="card y"><div class="big-num">🌰 ' + a + '</div><p>Уровень: <b>' + cur.n + '</b></p>' + (nx ? '<p class="small">До уровня «' + nx.n + '» осталось ' + (nx.min - a) + ' 🌰</p>' : '<p class="small">Максимальный уровень!</p>') +
      '<p><label>Как тебя зовут? <input type="text" id="nameIn" value="' + esc(S.name) + '" maxlength="40" placeholder="Имя для диплома"></label></p></div>' +
      '<div class="card b"><h3>Как заработать желуди</h3><ul><li>Тест без ошибок — 10 🌰</li><li>Тест с 1–2 ошибками — 5 🌰</li><li>Победа в игре — 3 🌰</li><li>Творческая работа — 15 🌰</li><li>Вход на сайт раз в день — 1 🌰</li></ul></div></div>' +
      '<h3 class="sect">Уровни путешественника</h3><div class="levels">' + D.LEVELS.map(function (l, k) { return '<div class="lvl' + (k === i ? ' on' : '') + '"><span class="n">' + (k + 1) + '</span><div><b>' + l.n + '</b> (' + l.min + (D.LEVELS[k + 1] ? '–' + (D.LEVELS[k + 1].min - 1) : '+') + ' 🌰)<br><small>' + l.d + '</small></div></div>'; }).join('') + '</div>' +
      '<h3 class="sect">Бейджи</h3><div class="badges">' + D.BADGES.map(function (b) { return '<div class="bdg' + (S.badges[b.id] ? ' on' : '') + '"><div class="i">' + b.i + '</div><b>' + b.n + '</b><br><small>' + b.d + '</small></div>'; }).join('') + '</div>' +
      '<p class="sect"><a class="btn primary" href="#diploma">🎓 Диплом Юного Краеведа</a></p></div>';
    post.push(function () { $('#nameIn').oninput = function () { S.name = this.value; save(); }; });
    return h;
  }
  function diplomaView() {
    var done = [1, 2, 3, 4, 5].filter(stopDone).length;
    var h = '<div class="wrap page">' + head('', '🎓 Диплом Юного Краеведа Беларуси');
    if (done < 5) {
      h += '<div class="callout">Пройдено остановок: <b>' + done + ' из 5</b>. Пройди тесты всех остановок, и Тимка вручит тебе диплом с печатью!</div><p><a class="btn primary" href="#home">Вернуться на карту</a></p>';
    } else {
      h += '<div class="diploma"><div id="dipB" style="width:120px;margin:0 auto"></div><h2>ДИПЛОМ</h2><p>Юного Краеведа Беларуси</p><p>вручается</p><p><span class="nm" id="dipName">' + esc(S.name || 'Юный краевед') + '</span></p>' +
        '<p>за прохождение курса «Белорусская Шкатулка: Тайны родной земли»<br>и знание родной природы</p><p>' + new Date().toLocaleDateString('ru-RU') + ' · Бобёр Тимка</p><div class="seal">Тимка<br>★</div></div>' +
        '<p class="noprint" style="text-align:center"><input type="text" id="dipIn" placeholder="Впиши своё имя" value="' + esc(S.name) + '" style="max-width:280px"> <button class="btn primary" onclick="window.print()" type="button">🖨️ Распечатать</button></p>' +
        '<div class="callout g noprint">Бонус от Тимки: финальный мультфильм о красоте родной страны Беларуси. <span class="pill p-y">будет добавлен</span></div>';
      post.push(function () { var g = Beaver.make('cheer'); extraGuides.push(g); $('#dipB').appendChild(g); $('#dipIn').oninput = function () { S.name = this.value; save(); $('#dipName').textContent = this.value || 'Юный краевед'; }; confetti(); say('Поздравляю! Ты Юный Краевед Беларуси!', 'cheer'); });
    }
    return h + '</div>';
  }

  /* ---------- маршрутизатор ---------- */
  var MSG = {
    home: ['Выбери флажок на карте — и в путь!', 'wink'], games: ['Поиграем? Я буду за тебя болеть!', 'cheer'], library: ['Тсс… Это мои секретные записи.', 'wink'],
    parents: ['Здравствуйте! Я помогу вам помочь ребёнку.', 'hi'], teachers: ['Добро пожаловать на методическую поляну!', 'hi'], backpack: ['Вот твой рюкзак! Смотри, сколько желудей!', 'joy'], diploma: ['Диплом — за настоящее знание родного края!', 'joy']
  };
  function route(keep) {
    var r = (location.hash || '#home').slice(1), view = $('#view'), m = /^stop-([1-5])$/.exec(r), html;
    post = [];
    if (m) html = stopView(+m[1]);
    else if (r === 'games') html = gamesView();
    else if (r === 'library') html = libraryView();
    else if (r === 'parents') html = parentsView();
    else if (r === 'teachers') html = teachersView();
    else if (r === 'backpack') html = backpackView();
    else if (r === 'diploma') html = diplomaView();
    else { r = 'home'; html = homeView(); }
    extraGuides = extraGuides.filter(function (g) { return g.isConnected; });
    view.innerHTML = html;
    if (!keep) { view.classList.remove('view-in'); void view.offsetWidth; view.classList.add('view-in'); window.scrollTo(0, 0); }
    document.querySelectorAll('#menu a').forEach(function (a) { a.classList.toggle('on', a.dataset.r === r); });
    post.forEach(function (f) { f(); });
    if (!keep) {
      if (m) { var s = D.STOPS[+m[1] - 1]; say('Остановка ' + s.id + ': «' + s.title + '». ' + s.intro, 'hi'); }
      else if (MSG[r]) say(MSG[r][0], MSG[r][1]);
    }
    $('#menu').classList.remove('open');
  }

  /* ---------- события ---------- */
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) { location.hash = go.dataset.go; return; }
    var el = e.target.closest('[data-act]'); if (!el) return;
    var a = el.dataset.act;
    if (a === 'tab') { ui[el.dataset.k] = el.dataset.t; route(true); }
    else if (a === 'warm') {
      if (!$('#warmTxt').value.trim()) { toast('Сначала напиши ответ'); return; }
      $('#warmFb').textContent = 'Хороший ответ! Теперь откроем «Узнаю» и проверим.'; say('Отлично подумал(а)! Идём дальше.', 'joy');
    } else if (a === 'make') {
      var n = +el.dataset.n; if (S.created[n]) return;
      if (!$('#mkTxt').value.trim() && $('#photoPrev').hidden) { toast('Добавь фото или напиши текст'); return; }
      S.created[n] = true; save(); earn(15, 'за творческую работу'); confetti(); route(true);
    } else if (a === 'gopen') { ui.gopen = ui.gopen === el.dataset.g ? null : el.dataset.g; route(true); }
    else if (a === 'clearpins') { S.marks = []; save(); if (window.__redraw) window.__redraw(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-go]')) { e.preventDefault(); location.hash = e.target.dataset.go; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'photoIn' && t.files && t.files[0]) {
      var img = $('#photoPrev'); img.src = URL.createObjectURL(t.files[0]); img.hidden = false; say('Красота! Не забудь сохранить работу.', 'wow');
    } else if (t.dataset && t.dataset.act === 'read') {
      S.read['x' + t.dataset.i] = t.checked; save(); checkBadges();
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.dataset.form) {
      e.preventDefault(); S.forms[f.dataset.form] = Object.fromEntries(new FormData(f).entries()); save();
      $('#ff-' + f.dataset.form).textContent = '✅ Спасибо! Ответ сохранён на этом устройстве.'; say('Спасибо за отзыв!', 'joy');
    } else if (f.dataset.board) {
      e.preventDefault(); var k = f.dataset.board; S.posts[k] = S.posts[k] || [];
      S.posts[k].push({ t: f.m.value, d: new Date().toLocaleString('ru-RU') }); save();
      if (k === 'parentbook') { f.reset(); toast('Спасибо! Сообщение сохранено.'); } else route(true);
    }
  });
  $('#burger').onclick = function () { var o = $('#menu').classList.toggle('open'); this.setAttribute('aria-expanded', o); };
  window.addEventListener('hashchange', function () { route(false); });

  /* ---------- старт ---------- */
  if (S.day !== today) { S.day = today; S.acorns += 1; save(); setTimeout(function () { toast('+1 🌰 за визит сегодня!'); }, 900); }
  hud(); route(false);
})();
