/**
 * The hero stage (MOTION.md → Stage).
 *
 * - Tabs: a real tablist. Click/tap, ←/→, Home/End. The selected state changes in the same frame (CSS), the scene in
 *   --dur-4. Rapid repeats just restart the scene; nothing ever blocks a click.
 * - The line: measured from the real elements, never hard-coded. On wide screens it starts at the headline's full stop,
 *   crosses into the stage at the same height, and routes through the active scene's elements. Recomputed on resize,
 *   when fonts load, and on every scene change.
 * - Depth: on fine pointers with Motion on, the portrait and the scene shift a few pixels against each other.
 * - Shared choice: the chosen need is stored for this visit (sessionStorage "mp-need") and announced as "needchange",
 *   so the playground and the brief further down follow it.
 */
import { motionOn } from './prefs';
import { track } from './analytics';

type Edge = string; // t, b, l, r, tl, tr, bl, br, optionally with a percentage along that side: "b30", "l50"
type Hop = [string, Edge, string, Edge];

const ROUTES: Record<string, Hop[]> = {
  website: [['@entry', 'l', '.sc-web__select', 'l50']],
  found: [
    ['@entry', 'l', '.sc-found__search', 'l50'],
    ['.sc-found__search', 'b25', '.sc-found__result', 't25'],
    ['.sc-found__btns .is-hit', 'b50', '.sc-found__page', 't20'],
  ],
  admin: [
    ['@entry', 'l', '.sc-admin__in', 'l50'],
    ['.sc-admin__in', 'b75', '.sc-admin__reply', 't25'],
    ['.sc-admin__reply', 'b20', '.sc-admin__list', 't55'],
    ['.sc-admin__list', 'b45', '.sc-admin__remind', 't30'],
  ],
};

/** The element's box relative to `root`, from offsets (ignores transforms, so mid-animation reads are stable). */
function box(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function point(b: { x: number; y: number; w: number; h: number }, edge: Edge): [number, number] {
  const side = edge.replace(/\d+/g, '');
  const pct = /\d+/.test(edge) ? Number(edge.match(/\d+/)![0]) / 100 : 0.5;
  switch (side) {
    case 't':
      return [b.x + b.w * pct, b.y];
    case 'b':
      return [b.x + b.w * pct, b.y + b.h];
    case 'l':
      return [b.x, b.y + b.h * pct];
    case 'r':
      return [b.x + b.w, b.y + b.h * pct];
    case 'tl':
      return [b.x, b.y];
    case 'tr':
      return [b.x + b.w, b.y];
    case 'bl':
      return [b.x, b.y + b.h];
    default:
      return [b.x + b.w, b.y + b.h];
  }
}

/** A smooth connector: leaves and arrives along the dominant axis. */
function curve([fx, fy]: [number, number], [tx, ty]: [number, number]) {
  const r = (n: number) => Math.round(n * 10) / 10;
  if (Math.abs(ty - fy) > Math.abs(tx - fx)) {
    const m = (ty - fy) / 2;
    return `M${r(fx)} ${r(fy)} C${r(fx)} ${r(fy + m)} ${r(tx)} ${r(ty - m)} ${r(tx)} ${r(ty)}`;
  }
  const m = (tx - fx) / 2;
  return `M${r(fx)} ${r(fy)} C${r(fx + m)} ${r(fy)} ${r(tx - m)} ${r(ty)} ${r(tx)} ${r(ty)}`;
}

export function initStage(hero: HTMLElement) {
  const stage = hero.querySelector<HTMLElement>('[data-stage]');
  const screen = hero.querySelector<HTMLElement>('[data-stage-screen]');
  const tabs = [...hero.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const svg = hero.querySelector<SVGSVGElement>('[data-stage-svg]');
  const path = hero.querySelector<SVGPathElement>('[data-stage-path]');
  const connector = hero.querySelector<SVGSVGElement>('[data-connector]');
  const connPath = connector?.querySelector('path');
  const origin = hero.querySelector<HTMLElement>('[data-line-origin]');
  const count = hero.querySelector<HTMLElement>('[data-stage-count]');
  const note = hero.querySelector<HTMLElement>('[data-stage-note]');
  if (!stage || !screen || !tabs.length || !svg || !path) return;

  const notes: Record<string, string> = {};
  hero.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => {
    // The note shown on the screen comes from the server-rendered first label; keep one per scene.
    notes[p.dataset.panel!] = '';
  });
  notes.website = 'Real capture, 8 Nov 2026';
  notes.found = 'Illustration, not a real search result';
  notes.admin = 'Demo: nothing is sent';

  const wide = matchMedia('(min-width: 64em)');
  let current = stage.dataset.scene || 'website';

  /** The y where the line enters the stage: level with the full stop (wide screens only). */
  // Measured with offsets (transform-free), so the headline's entrance animation never skews the line.
  const entryY = () => {
    if (!wide.matches || !origin) return null;
    const o = box(origin, hero);
    const s = box(screen, hero);
    const y = o.y + o.h * 0.74 - s.y;
    return Math.max(s.h * 0.12, Math.min(s.h * 0.88, y));
  };

  const drawConnector = () => {
    if (!connector || !connPath || !origin || !wide.matches) return;
    const ey = entryY();
    if (ey === null) return;
    const o = box(origin, hero);
    const s = box(screen, hero);
    connector.setAttribute('viewBox', `0 0 ${hero.offsetWidth} ${hero.offsetHeight}`);
    const from: [number, number] = [o.x + o.w + 8, o.y + o.h * 0.74];
    const to: [number, number] = [s.x, s.y + ey];
    connPath.setAttribute('d', curve(from, to));
  };

  const drawRoute = () => {
    const w = screen.clientWidth;
    const h = screen.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const ey = entryY();
    const scene = screen.querySelector<HTMLElement>(`.sc-${current === 'website' ? 'web' : current}`);
    const d: string[] = [];
    for (const [a, ea, b, eb] of ROUTES[current] ?? []) {
      const to = (scene ?? screen).querySelector<HTMLElement>(b);
      if (!to) continue;
      let from: [number, number] | null = null;
      if (a === '@entry') {
        if (ey === null) continue; // phones: no entry from the headline
        from = [0, ey];
      } else {
        const el = (scene ?? screen).querySelector<HTMLElement>(a);
        if (el) from = point(box(el, screen), ea);
      }
      if (from) d.push(curve(from, point(box(to, screen), eb)));
    }
    path.setAttribute('d', d.join(' '));
    stage.classList.toggle('has-line', d.length > 0);
  };

  const redraw = () => {
    drawRoute();
    drawConnector();
  };

  const play = () => {
    stage.removeAttribute('data-play');
    connector?.classList.remove('is-drawing');
    if (!motionOn()) return;
    void stage.offsetWidth; // restart the CSS animations
    stage.setAttribute('data-play', '');
    connector?.classList.add('is-drawing');
  };

  const select = (i: number, { focus = false, user = true } = {}) => {
    const tab = tabs[i];
    if (!tab) return;
    tabs.forEach((t, j) => {
      const on = j === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls')!);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    current = tab.dataset.need!;
    stage.dataset.scene = current;
    if (count) count.textContent = `0${i + 1}`;
    if (note) note.textContent = notes[current] ?? '';
    redraw();
    play();
    if (user) {
      try {
        sessionStorage.setItem('mp-need', current);
      } catch {
        /* storage blocked */
      }
      dispatchEvent(new CustomEvent('needchange', { detail: { need: current, from: 'hero' } }));
      track('service_demo_start', { demo: current, location: 'hero' });
    }
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(next, { focus: true });
    });
  });
  hero.querySelectorAll<HTMLButtonElement>('[data-stage-replay]').forEach((b) =>
    b.addEventListener('click', () => {
      play();
      track('service_demo_start', { demo: current, location: 'hero_replay' });
    }),
  );

  // A need chosen further down (the playground) is reflected here too, without scrolling or analytics.
  addEventListener('needchange', (e) => {
    const { need, from } = (e as CustomEvent).detail ?? {};
    if (from === 'hero') return;
    const i = tabs.findIndex((t) => t.dataset.need === need);
    if (i >= 0 && tabs[i].getAttribute('aria-selected') !== 'true') select(i, { user: false });
  });

  // Depth on fine pointers (a few pixels, transform only, rAF-throttled).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0;
    stage.addEventListener('pointermove', (e) => {
      if (!motionOn() || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = screen.getBoundingClientRect();
        screen.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        screen.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    });
    stage.addEventListener('pointerleave', () => {
      screen.style.setProperty('--px', '0');
      screen.style.setProperty('--py', '0');
    });
  }

  // Geometry is drawn from the ResizeObserver callback: it runs right after layout (its first call comes with the first
  // frame), so reading offsets there forces nothing (gate M7). Redrawing only rewrites SVG paths, which never resize the
  // observed boxes. Fonts can move the full stop without resizing the hero, so they get one redraw at an idle moment.
  const ro = new ResizeObserver(redraw);
  ro.observe(hero);
  ro.observe(screen);
  document.fonts?.ready.then(() => ('requestIdleCallback' in window ? requestIdleCallback(redraw) : setTimeout(redraw, 200)));
  wide.addEventListener('change', redraw);
  addEventListener('motionchange', () => (motionOn() ? play() : stage.removeAttribute('data-play')));

  // The entrance plays once on load from the markup's own data-play (no script, no reflow); the static first frame is
  // already complete without it.

  // Stop observing when the page is hidden for good (bfcache keeps it; a real unload releases it).
  addEventListener('pagehide', (e) => {
    if (!(e as PageTransitionEvent).persisted) ro.disconnect();
  });
}
