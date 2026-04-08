/* ═══════════════════════════════════════════════
   nav.js – Shared Navigation Component
   Füge <script src="../js/nav.js"></script> in
   jede HTML-Datei ein (Pfad je nach Tiefe anpassen)
   ═══════════════════════════════════════════════ */

(function () {

  /* ── Navigationsstruktur ───────────────────── */
  const NAV = [
    { label: 'Start',       href: 'startseite.html',        root: true },
    {
      label: 'KOEA',
      sub: [
        { label: '4. Klasse', href: 'koea/4-klasse.html' },
        { label: '5. Klasse', href: 'koea/5-klasse.html' },
      ]
    },
    {
      label: 'MINF',
      sub: [
        { label: '1. Klasse', href: 'minf/1-klasse.html' },
        { label: '2. Klasse', href: 'minf/2-klasse.html' },
        { label: '3. Klasse', href: 'minf/3-klasse.html' },
      ]
    },
    {
      label: 'IMSK',
      sub: [
        { label: '2. Klasse', href: 'imsk/2-klasse.html' },
        { label: '3. Klasse', href: 'imsk/3-klasse.html' },
      ]
    },
    {
      label: 'WOP',
      sub: [
        { label: '3. Klasse', href: 'wop/3-klasse.html' },
        { label: '4. Klasse', href: 'wop/4-klasse.html' },
        { label: '5. Klasse', href: 'wop/5-klasse.html' },
      ]
    },
    {
      label: 'NTMA',
      sub: [
        { label: '3. Klasse', href: 'ntma/3-klasse.html' },
        { label: '4. Klasse', href: 'ntma/4-klasse.html' },
      ]
    },
    { label: 'Lebenslauf', href: 'lebenslauf.html' },
    { label: 'Über mich',  href: 'ueber-mich.html'  },
    { label: 'Kontakt',    href: 'kontakt.html', cta: true },
  ];

  /* ── Pfad-Tiefe erkennen ───────────────────── */
  // Dateien in Unterordnern brauchen '../' vor den Hrefs
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const isRoot = depth <= 1;
  const prefix = isRoot ? '' : '../';

  function resolveHref(href) {
    return prefix + href;
  }

  /* ── Chevron SVG ───────────────────────────── */
  const chevron = `<svg class="chevron" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  /* ── Nav HTML aufbauen ─────────────────────── */
  function buildNav() {
    const items = NAV.map(item => {
      if (item.cta) {
        return `<li class="nav-item">
          <a href="${resolveHref(item.href)}" class="nav-cta">${item.label}</a>
        </li>`;
      }
      if (item.sub) {
        const drops = item.sub.map(s =>
          `<a href="${resolveHref(s.href)}">${s.label}</a>`
        ).join('');
        return `<li class="nav-item has-sub">
          <a href="${resolveHref(item.label.toLowerCase() + '/' + item.label.toLowerCase() + '.html')}" class="nav-link">
            ${item.label}${chevron}
          </a>
          <div class="nav-dropdown">${drops}</div>
        </li>`;
      }
      return `<li class="nav-item">
        <a href="${resolveHref(item.href)}" class="nav-link">${item.label}</a>
      </li>`;
    }).join('');

    return `
    <nav class="site-nav" id="site-nav">
      <a href="${resolveHref('startseite.html')}" class="nav-logo">KAYA</a>
      <ul class="nav-menu" id="nav-menu">${items}</ul>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menü öffnen">
        <span></span><span></span><span></span>
      </button>
    </nav>`;
  }

  /* ── Footer HTML ───────────────────────────── */
  function buildFooter() {
    return `
    <footer class="site-footer">
      <span class="footer-logo">KAYA</span>
      <p class="footer-copy">© 2025 Ogulcan Kaya · Media HAK Schwaz</p>
      <div class="footer-links">
        <a href="${resolveHref('lebenslauf.html')}">Lebenslauf</a>
        <a href="https://github.com/" target="_blank" rel="noopener">GitHub</a>
        <a href="${resolveHref('kontakt.html')}">Kontakt</a>
      </div>
    </footer>`;
  }

  /* ── Einfügen ──────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    // Nav einfügen
    const navEl = document.createElement('div');
    navEl.innerHTML = buildNav();
    document.body.insertAdjacentElement('afterbegin', navEl.firstElementChild);

    // Footer einfügen (wenn <footer id="site-footer"> vorhanden)
    const footerPlaceholder = document.getElementById('site-footer');
    if (footerPlaceholder) {
      footerPlaceholder.outerHTML = buildFooter();
    }

    // Mobile Toggle
    const toggle = document.getElementById('nav-toggle');
    const menu   = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.site-nav')) {
          menu.classList.remove('open');
          document.querySelectorAll('.nav-item.has-sub.sub-open')
            .forEach(function (el) { el.classList.remove('sub-open'); });
        }
      });
    }

    // Submenu Accordion (nur Mobile)
    document.querySelectorAll('.nav-item.has-sub > .nav-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          this.parentElement.classList.toggle('sub-open');
        }
      });
    });

    // Aktive Seite markieren
    const current = window.location.pathname;
    document.querySelectorAll('.nav-link, .nav-dropdown a').forEach(link => {
      if (current.includes(link.getAttribute('href'))) {
        link.classList.add('active');
      }
    });
  });

})();
