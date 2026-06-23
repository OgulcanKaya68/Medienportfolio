/* ═══════════════════════════════════════════════
   main.js – Portfolio Interaktionen
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Navigation ─────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu   = document.getElementById('nav-menu');

  // Hamburger öffnen/schließen (stopPropagation verhindert sofortiges Schließen)
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navMenu.classList.toggle('open');
    });
  }

  // Menü schließen wenn außerhalb geklickt
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-nav')) {
      if (navMenu) navMenu.classList.remove('open');
      document.querySelectorAll('.nav-item.has-sub.sub-open')
        .forEach(function (el) { el.classList.remove('sub-open'); });
    }
  });

  // Submenu Accordion (Mobile + Desktop)
  document.querySelectorAll('.nav-item.has-sub > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = this.parentElement;
      var wasOpen = parent.classList.contains('sub-open');

      document.querySelectorAll('.nav-item.has-sub').forEach(function (item) {
        item.classList.remove('sub-open');
      });

      if (!wasOpen) {
        parent.classList.add('sub-open');
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

  /* ── Hybrid Typing Effect ──────────────────── */
  (function() {
    const PHRASES = [
      'Softwareentwickler.',
      'KI-Entwickler.',
      'Maturant der BHAK Schwaz.',
      'Webentwickler aus Tirol.',
    ];

    const textEl = document.getElementById('tw-text');
    const cursor = document.querySelector('.tw-cursor');
    if (!textEl) return;

    let pi = 0;

    function setActive(on) {
      if (on) textEl.classList.add('tw-active');
      else textEl.classList.remove('tw-active');
    }

    // Phase 1: typewriter for first phrase only
    function typePhrase(phrase, done) {
      let i = 0;
      if (cursor) cursor.style.opacity = '1';
      setActive(true);

      function tick() {
        i++;
        // Build HTML: all previous letters as plain spans, last letter with animation class
        let html = '';
        for (let j = 0; j < i; j++) {
          const ch = phrase[j] === ' ' ? '&nbsp;' : phrase[j];
          const cls = (j === i - 1) ? 'tw-letter tw-letter-new' : 'tw-letter';
          html += `<span class="${cls}">${ch}</span>`;
        }
        textEl.innerHTML = html;

        if (i < phrase.length) {
          setTimeout(tick, 50);
        } else {
          textEl.classList.add('tw-underline');
          if (cursor) cursor.style.opacity = '0';
          setTimeout(done, 1400);
        }
      }
      tick();
    }

    // Phase 2: slide+blur for all subsequent phrases
    function transitionTo(phrase, done) {
      textEl.classList.remove('tw-underline');
      textEl.classList.add('tw-slide-out');
      if (cursor) cursor.style.opacity = '0';

      setTimeout(() => {
        textEl.classList.remove('tw-slide-out');
        textEl.innerHTML = '';
        textEl.textContent = phrase;
        setActive(true);
        textEl.classList.add('tw-slide-in');

        setTimeout(() => {
          textEl.classList.remove('tw-slide-in');
          textEl.classList.add('tw-underline');
          setTimeout(done, 1700);
        }, 320);
      }, 220);
    }

    function next() {
      pi = (pi + 1) % PHRASES.length;
      transitionTo(PHRASES[pi], next);
    }

    // Start
    setTimeout(() => typePhrase(PHRASES[0], next), 600);
  })();

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
