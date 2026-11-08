/* Мини-игры «Игровой поляны» (работают прямо на сайте) */
window.Games = (function () {
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* универсальная игра «Подбери»: к каждой строке нужно выбрать верный вариант */
  function matcher(box, cfg, done) {
    var h = (cfg.svg || '') + '<div id="mrows">';
    cfg.rows.forEach(function (r, i) {
      h += '<div class="mrow" data-i="' + i + '"><span class="ml">' + r.l + '</span><select aria-label="Выбор"><option value="">— выбери —</option>' +
        cfg.opts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select><span class="mm"></span></div>';
    });
    h += '</div><p><button class="btn primary small" type="button" id="mchk">Проверить</button> <span id="mres" class="fb"></span></p>';
    box.innerHTML = h;
    var won = false;
    box.querySelector('#mchk').onclick = function () {
      var ok = 0, empty = 0;
      box.querySelectorAll('.mrow').forEach(function (row) {
        var r = cfg.rows[+row.dataset.i], v = row.querySelector('select').value, mm = row.querySelector('.mm');
        row.classList.remove('ok', 'bad'); mm.textContent = '';
        if (!v) { empty++; return; }
        if (v === r.a) { ok++; row.classList.add('ok'); }
        else { row.classList.add('bad'); mm.textContent = '💬 ' + (r.h || 'Подумай ещё раз.'); }
      });
      var res = box.querySelector('#mres');
      if (ok === cfg.rows.length) {
        res.textContent = '🎉 Всё верно!'; App.say(cfg.win || 'Ура! Всё верно!', 'cheer');
        if (!won) { won = true; done(); }
      } else if (empty) { res.textContent = 'Заполни все строки.'; App.say('Выбери ответ в каждой строке!', 'think'); }
      else { res.textContent = 'Верно: ' + ok + ' из ' + cfg.rows.length + '. Прочитай подсказки.'; App.say('Ой, не всё верно. Посмотри подсказки!', 'sad'); }
    };
  }

  function marker(n, x, y) {
    return '<g><circle cx="' + x + '" cy="' + y + '" r="15" fill="#d64550" stroke="#fff" stroke-width="3"/><text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">' + n + '</text></g>';
  }

  var G = {};

  G.g1 = function (box, done) {
    var names = ['Минская возвышенность', 'Полоцкая низина', 'Центральноберезинская равнина'];
    var svg = Beaver.mapSVG(marker(1, 270, 232) + marker(2, 330, 110) + marker(3, 395, 305));
    matcher(box, {
      svg: svg, opts: names,
      rows: [
        { l: 'Метка <b>①</b> (жёлтое пятно)', a: names[0], h: 'Жёлтый цвет — возвышенности. Метка стоит на холмах в центре страны.' },
        { l: 'Метка <b>②</b> (на севере)', a: names[1], h: 'Это зелёная низина на севере страны, рядом течёт Западная Двина.' },
        { l: 'Метка <b>③</b> (у реки Березины)', a: names[2], h: 'Эта равнина названа по реке Березине.' }
      ],
      win: 'Картограф, ты молодец! Тимка брызгает водой от радости!'
    }, done);
  };

  G.g2 = function (box, done) {
    var tiers = ['1-й ярус: высокие деревья', '2-й ярус: подлесок', '3-й ярус: кустарники', '4-й ярус: травы', '5-й ярус: мхи'];
    matcher(box, {
      opts: tiers,
      rows: [
        { l: '🌲 Сосна', a: tiers[0], h: 'Сосна — высокое дерево, её место на самом верху.' },
        { l: '🌳 Рябина', a: tiers[1], h: 'Рябина ниже сосен и дубов — это деревце подлеска.' },
        { l: '🍓 Малина', a: tiers[2], h: 'Ой, малина не может расти так высоко, она же кустарник!' },
        { l: '🌿 Кислица', a: tiers[3], h: 'Кислица — невысокая трава.' },
        { l: '🟢 Мох', a: tiers[4], h: 'Мхи прижимаются к самой земле — это нижний ярус.' }
      ],
      win: 'Лесной конструктор готов! Все растения на своих этажах.'
    }, done);
  };

  G.g3 = function (box, done) {
    var parts = ['Исток', 'Русло', 'Левый берег', 'Правый берег', 'Устье'];
    var svg = '<svg viewBox="0 0 620 280"><rect width="620" height="280" fill="#d8f0d2"/>' +
      '<path d="M20 150 Q120 105 210 150 T400 150 T600 165" fill="none" stroke="#59b4ea" stroke-width="34" stroke-linecap="round"/>' +
      '<ellipse cx="600" cy="172" rx="22" ry="28" fill="#3d9bd6"/>' +
      '<text x="310" y="30" text-anchor="middle" font-size="16" fill="#24324d" font-weight="700">течение реки ➜ (смотрим по течению)</text>' +
      marker(1, 28, 150) + marker(2, 205, 150) + marker(3, 300, 88) + marker(4, 300, 216) + marker(5, 590, 150) + '</svg>';
    matcher(box, {
      svg: svg, opts: parts,
      rows: [
        { l: 'Метка <b>①</b>', a: 'Исток', h: 'Здесь река только начинается.' },
        { l: 'Метка <b>②</b> (посередине реки)', a: 'Русло', h: 'Углубление, по которому течёт вода.' },
        { l: 'Метка <b>③</b> (сверху)', a: 'Левый берег', h: 'Река течёт слева направо. Повернись по течению: север (верх) окажется слева.' },
        { l: 'Метка <b>④</b> (снизу)', a: 'Правый берег', h: 'Смотрим по течению: справа от нас нижний берег.' },
        { l: 'Метка <b>⑤</b>', a: 'Устье', h: 'Здесь река впадает в другую реку или озеро.' }
      ],
      win: 'Детектив, ты раскрыл тайну реки! Факт: самая длинная река Беларуси — Днепр.'
    }, done);
  };

  G.g4 = function (box, done) {
    var S = [
      { q: '🔥 Мальчик развёл костёр в ветреную погоду.', o: ['Это правильно', 'Это опасно: может начаться лесной пожар', 'Это нормально, если рядом река'], a: 1, why: 'В ветер искры летят далеко. Костёр без взрослых разводить нельзя.' },
      { q: '🍾 Девочка оставила пластиковую бутылку под кустом.', o: ['Так поступать нельзя: бутылка пролежит до 200 лет', 'Можно, лес большой', 'Можно, если присыпать листьями'], a: 0, why: 'Мусор нужно забирать с собой.' },
      { q: '🏕️ Туристы аккуратно затушили костёр и забрали мусор.', o: ['Это зря потраченное время', 'Правильно, так поступают друзья леса', 'Мусор надо было оставить'], a: 1, why: 'Затушили костёр и убрали за собой — лес в безопасности.' }
    ], i = 0, err = 0;
    function show() {
      if (i >= S.length) {
        box.innerHTML = '<div class="result"><div class="big">🌲</div><p>Патруль завершён! Ошибок: ' + err + '.</p></div>';
        if (err <= 1) { App.say('Отличный патруль!', 'cheer'); done(); } else App.say('Попробуем ещё раз?', 'think');
        if (err > 1) box.innerHTML += '<p><button class="btn small" type="button" id="rt">Ещё раз</button></p>';
        var rt = box.querySelector('#rt'); if (rt) rt.onclick = function () { i = 0; err = 0; show(); };
        return;
      }
      var s = S[i];
      box.innerHTML = '<div class="sit"><p class="qtext">' + s.q + '</p><div class="opts">' +
        s.o.map(function (o, k) { return '<button class="opt" type="button" data-k="' + k + '">' + o + '</button>'; }).join('') + '</div><p class="fb" id="gf"></p></div>';
      box.querySelectorAll('.opt').forEach(function (b) {
        b.onclick = function () {
          var k = +b.dataset.k;
          if (k === s.a) {
            box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
            b.classList.add('ok'); box.querySelector('#gf').textContent = '✅ ' + s.why; App.say('Верно!', 'joy');
            i++; setTimeout(show, 2200);
          } else { err++; b.classList.add('bad'); b.disabled = true; box.querySelector('#gf').textContent = 'Подумай ещё: что будет с лесом?'; App.say('Ой, подумай ещё раз.', 'sad'); }
        };
      });
    }
    show();
  };

  G.g5 = function (box, done) {
    var A = {
      hollow: ['🐿️', 'Белка', 'живёт в дупле дерева'],
      burrow: ['🦊', 'Лиса', 'прячется в норе'],
      bush: ['🐗', 'Кабан', 'отдыхает в густых зарослях'],
      trunk: ['🐦', 'Дятел', 'сидит на стволе и ищет жуков под корой']
    }, found = {}, n = 0;
    var svg = '<svg viewBox="0 0 620 300"><rect width="620" height="300" fill="#cfeaf9"/><rect y="200" width="620" height="100" fill="#7bbf6a"/>' +
      '<rect x="120" y="40" width="46" height="170" fill="#8a5a2b" rx="8"/><circle cx="143" cy="55" r="70" fill="#2f8f5b"/>' +
      '<rect x="420" y="70" width="40" height="140" fill="#7a4d23" rx="8"/><circle cx="440" cy="75" r="60" fill="#3fa56a"/>' +
      '<g class="spot" data-k="hollow" tabindex="0"><ellipse cx="143" cy="110" rx="14" ry="20" fill="#3b2412"/><text x="143" y="150" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">дупло</text></g>' +
      '<g class="spot" data-k="trunk" tabindex="0"><rect x="428" y="130" width="24" height="40" rx="6" fill="#a8743f" stroke="#fff" stroke-width="2" stroke-dasharray="4"/><text x="440" y="190" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">ствол</text></g>' +
      '<g class="spot" data-k="burrow" tabindex="0"><ellipse cx="290" cy="250" rx="30" ry="16" fill="#3b2412"/><text x="290" y="285" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">нора</text></g>' +
      '<g class="spot" data-k="bush" tabindex="0"><circle cx="540" cy="225" r="34" fill="#1f6f43"/><circle cx="515" cy="240" r="24" fill="#2a8552"/><text x="540" y="278" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">куст</text></g></svg>';
    box.innerHTML = svg + '<p class="fb">Нажимай на дупло, нору, куст и ствол — найди 4 лесных жителей. Найдено: <b id="fc">0</b> из 4</p><div class="found" id="fl"></div>';
    box.querySelectorAll('.spot').forEach(function (s) {
      var act = function () {
        var k = s.dataset.k; if (found[k]) return; found[k] = 1; n++;
        var a = A[k];
        box.querySelector('#fl').insertAdjacentHTML('beforeend', '<span>' + a[0] + ' ' + a[1] + ' — ' + a[2] + '</span>');
        box.querySelector('#fc').textContent = n; App.say(a[1] + ' нашлась! ' + (n < 4 ? 'Ищи дальше!' : ''), 'wow');
        if (n === 4) { App.say('Ты нашёл всех жителей леса!', 'cheer'); done(); }
      };
      s.onclick = act; s.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } };
    });
  };

  G.g6 = function (box, done) {
    matcher(box, {
      opts: ['река', 'озеро'],
      rows: [
        { l: 'Есть исток и устье', a: 'река', h: 'Исток и устье бывают только у реки.' },
        { l: 'Вода почти не течёт', a: 'озеро', h: 'Течение — это признак реки.' },
        { l: 'В неё впадают притоки', a: 'река', h: 'Приток впадает в большую реку.' },
        { l: 'Нарочь', a: 'озеро', h: 'Нарочь — самое большое озеро Беларуси.' },
        { l: 'Днепр', a: 'река', h: 'Днепр — самая крупная река страны.' },
        { l: 'Замкнутое углубление с водой', a: 'озеро', h: 'Озеро замкнутое: у него нет истока и устья.' }
      ],
      win: 'Рыбалка удалась! Ты хорошо различаешь реки и озёра.'
    }, done);
  };

  return {
    mount: function (id, box) {
      if (!G[id]) return;
      G[id](box, function () { App.win(id); });
    }
  };
})();
