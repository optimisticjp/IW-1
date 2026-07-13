(() => {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');
  const header = toggle?.closest('.hdr');
  if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) return;
  if (toggle.dataset.navInit === 'true') return;
  toggle.dataset.navInit = 'true';

  const desktopQuery = window.matchMedia('(min-width: 900px)');
  let previousBodyOverflow = '';

  const visiblePanelFocusables = () => Array.from(panel.querySelectorAll('a[href], button:not([disabled]), summary'))
    .filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null);
  const focusables = () => [toggle, ...visiblePanelFocusables()];
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true' && !panel.hidden;

  const setClosedState = () => {
    panel.hidden = true;
    header?.classList.remove('hdr--mnav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    panel.querySelectorAll('details[open]').forEach((details) => { details.open = false; });
  };

  const open = () => {
    if (desktopQuery.matches || isOpen()) return;
    previousBodyOverflow = document.body.style.overflow;
    panel.hidden = false;
    header?.classList.add('hdr--mnav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => visiblePanelFocusables()[0]?.focus());
  };

  const close = (restoreFocus = true) => {
    const wasOpen = isOpen();
    setClosedState();
    document.body.style.overflow = previousBodyOverflow;
    if (restoreFocus && wasOpen) toggle.focus();
  };

  setClosedState();
  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) close(false); });
  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], firstMenu = f[1] || first, last = f[f.length - 1];
    if (!f.includes(document.activeElement)) { e.preventDefault(); firstMenu.focus(); }
    else if (e.shiftKey && document.activeElement === firstMenu) { e.preventDefault(); first.focus(); }
    else if (!e.shiftKey && document.activeElement === first) { e.preventDefault(); firstMenu.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  });
  desktopQuery.addEventListener('change', (ev) => { if (ev.matches) close(false); else setClosedState(); });
})();

document.querySelectorAll('.mega').forEach((mega) => {
  if (mega.dataset.megaInit === 'true') return;
  mega.dataset.megaInit = 'true';
  const summary = mega.querySelector('summary');
  mega.addEventListener('toggle', () => {
    if (!mega.open) return;
    document.querySelectorAll('.mega[open]').forEach((other) => { if (other !== mega) other.open = false; });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mega.open) { mega.open = false; summary?.focus(); } });
  document.addEventListener('click', (e) => { if (mega.open && !mega.contains(e.target)) mega.open = false; });
});
