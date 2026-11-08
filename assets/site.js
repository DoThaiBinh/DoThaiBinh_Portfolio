(function () {

  var root = document.documentElement, body = document.body;
  body.classList.remove('no-js');

  // theme toggle (remembered per viewer when storage is available)
  var btn = document.getElementById('themeBtn');
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  btn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // project filters
  var fbtns = document.querySelectorAll('.filters button');
  var cards = document.querySelectorAll('.project');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-tags').split(' ').indexOf(f) > -1;
        c.hidden = !show;
        if (show) c.classList.add('in');
      });
    });
  });

  // reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // language (English default; ?lang=vi or a saved choice switches to Vietnamese)
  var SEL = 'h1,h2,h3,p,li,small,figcaption,.btn,.filters button,.stat span,.metric,.when,.eyebrow,.flow li span,.nav a,.pubs a,.links a,.back';
  var norm = function (t) { return t.replace(/\s+/g, ' ').trim(); };
  var VI = window.VI || {}, VI_CAP = window.VI_CAP || {};
  var nodes = [];
  document.querySelectorAll(SEL).forEach(function (el) {
    if ((el.closest('.chips') && !el.classList.contains('tr')) || el.querySelector(SEL)) return;
    var vi = VI[norm(el.textContent)];
    if (vi) nodes.push({ el: el, en: el.innerHTML, vi: vi });
  });
  var enTitle = document.title, lang = 'en';
  var lbtns = document.querySelectorAll('.lang button');
  function setLang(l, save) {
    lang = l;
    nodes.forEach(function (n) { n.el.innerHTML = l === 'vi' ? n.vi : n.en; });
    root.setAttribute('lang', l);
    document.title = l === 'vi' ? (root.getAttribute('data-title-vi') || VI_CAP['__title'] || enTitle) : enTitle;
    lbtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
    if (save) { try { localStorage.setItem('lang', l); } catch (e) {} }
  }
  lbtns.forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });
  var want = 'en';
  try { var q = new URLSearchParams(location.search).get('lang'); if (q === 'vi' || q === 'en') { want = q; localStorage.setItem('lang', q); } else if (localStorage.getItem('lang') === 'vi') want = 'vi'; } catch (e) {}
  if (want === 'vi') setLang('vi', false);
  if (want === 'en') { try { if (new URLSearchParams(location.search).get('lang') === 'en') localStorage.setItem('lang', 'en'); } catch (e) {} }

  // lightbox
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap'), lbOpen = document.getElementById('lbOpen');
  document.querySelectorAll('.shot').forEach(function (s) {
    s.addEventListener('click', function () {
      var cap = s.getAttribute('data-cap'); if (lang === 'vi' && VI_CAP[cap]) cap = VI_CAP[cap];
      lbImg.src = s.getAttribute('data-full'); lbImg.alt = cap; lbCap.textContent = cap;
      lbOpen.href = s.getAttribute('data-full'); lbOpen.textContent = lang === 'vi' ? (VI_CAP['__open'] || 'Open full size \u2197') : 'Open full size \u2197';
      if (lb && lb.showModal) lb.showModal(); else window.open(s.getAttribute('data-full'), '_blank');
    });
  });
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
})();
