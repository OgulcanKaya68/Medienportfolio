/* ═══════════════════════════════════════════════
   main.js – Portfolio Interaktionen
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Navigation ─────────────────────── */
  // HINWEIS: Das Öffnen/Schließen des Hamburger-Menüs
  // ist in jedem HTML via inline-script geregelt.
  // Hier nur: Accordion für Submenüs + Close-on-outside.

  // Menü schließen wenn außerhalb geklickt
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-nav')) {
      const menu = document.getElementById('nav-menu');
      if (menu) menu.classList.remove('open');
      document.querySelectorAll('.nav-item.has-sub.sub-open')
        .forEach(function (el) { el.classList.remove('sub-open'); });
    }
  });

  // Submenu Accordion (nur Mobile)
  document.querySelectorAll('.nav-item.has-sub > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        this.parentElement.classList.toggle('sub-open');
      }
    });
  });

  /* ── Lightbox für Projektbilder ────────────── */
  (function () {
    // Overlay erstellen
    var lb = document.createElement('div');
    lb.className = 'lightbox-overlay';
    lb.innerHTML = '<div class="lightbox-inner"><img src="" alt="" /><button class="lightbox-close" aria-label="Schließen">&#x2715;</button></div>';
    document.body.appendChild(lb);

    var lbImg   = lb.querySelector('img');
    var lbClose = lb.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    lb.addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-inner').addEventListener('click', function (e) { e.stopPropagation(); });
    lbClose.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // Alle Projektbilder mit Hover-Wrapper versehen
    var selectors = [
      '.aufgabe-img',
      '.slide img',
      '.screenshot-item img',
      '.pdf-frame-wrap img',
      '.persona-steckbrief img',
    ];

    document.querySelectorAll(selectors.join(', ')).forEach(function (img) {
      if (img.closest('.img-zoom-wrap') || img.closest('.cv-preview-card')) return;

      var wrap = document.createElement('div');
      wrap.className = 'img-zoom-wrap';
      var overlay = document.createElement('div');
      overlay.className = 'img-zoom-overlay';
      overlay.innerHTML = '<span>Vergrößern</span>';

      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      wrap.appendChild(overlay);

      wrap.style.cursor = 'zoom-in';
      wrap.addEventListener('click', function () {
        openLightbox(img.src, img.alt);
      });
    });
  })();

  /* ── Typewriter Effekt ─────────────────────── */
  var twEl = document.getElementById('tw-text');
  if (twEl) {
    var phrases = [
      'Angehender Software Developer.',
      'Medieninformatik & Netzwerktechnik.',
      'Leidenschaftlich für sauberen Code.',
      'Auf der Suche nach meinem ersten Job.',
    ];
    var pi = 0, ci = 0, deleting = false;

    function tick() {
      var phrase = phrases[pi];
      if (deleting) {
        ci--;
        twEl.textContent = phrase.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 38);
      } else {
        ci++;
        twEl.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) { deleting = true; setTimeout(tick, 2400); return; }
        setTimeout(tick, 62);
      }
    }
    setTimeout(tick, 900);
  }

  /* ── Tabs System ───────────────────────────── */
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.dataset.tab;
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        var panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── Scroll Reveal ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(el);
    });
  }

  /* ── Stats Counter Animation ───────────────── */
  function animateCounter(el, target, duration) {
    var start = 0;
    var step = (target / duration) * 16;
    var interval = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target + (el.dataset.suffix || '');
        clearInterval(interval);
        return;
      }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, 16);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        animateCounter(el, parseInt(el.dataset.target), 1200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

});
