/**
 * The site's Motion preference (MOTION.md → Preference).
 *
 * <head> sets html[data-motion] to "on" or "off" before the first paint: the visitor's saved choice ("mp-motion" in
 * localStorage), else the OS setting (prefers-reduced-motion). This module wires every [data-motion-toggle] switch
 * (menu and footer), saves the choice, and tells scripts through a "motionchange" event so canvases, demos and the
 * stage can stop or start. CSS reads the attribute directly.
 */
const KEY = 'mp-motion';
const root = document.documentElement;

export function motionOn(): boolean {
  return root.getAttribute('data-motion') === 'on';
}

function sync() {
  const on = motionOn();
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(on));
    const state = b.querySelector('[data-motion-state]');
    if (state) state.textContent = on ? 'On' : 'Off';
  });
}

export function setMotion(on: boolean) {
  root.setAttribute('data-motion', on ? 'on' : 'off');
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  sync();
  dispatchEvent(new CustomEvent('motionchange', { detail: { on } }));
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-motion-toggle]');
  if (b) setMotion(!motionOn());
});

// Follow the OS setting live while the visitor hasn't chosen on this site.
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (q) => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* ignore */
  }
  if (saved === 'on' || saved === 'off') return;
  root.setAttribute('data-motion', q.matches ? 'off' : 'on');
  sync();
  dispatchEvent(new CustomEvent('motionchange', { detail: { on: !q.matches } }));
});

sync();
// Switches added later (the menu's contents join the page on first open) sync when they appear.
export const syncMotionSwitches = sync;
