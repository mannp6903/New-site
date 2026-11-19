/**
 * The service playground (MOTION.md → Playground). Local demonstrations only: nothing here sends, books or charges.
 *
 * - Before/after: a native range input (keyboard, screen readers) drives --pos; Before/After buttons jump; dragging on
 *   the image works on touch and mouse.
 * - Journey: step buttons, Next, and Play (runs the remaining steps once, 2.6 s apart, then stops; Pause stops it).
 *   Autoplay pauses when the demo leaves the screen or the tab is hidden.
 * - Flow: one button runs a sample enquiry through five steps (700 ms apart; at once with Motion off), announces each
 *   step politely, and becomes Replay. A second click mid-run restarts cleanly.
 * - "Your pick": the need chosen on the stage (needchange event / sessionStorage) marks its demo.
 */
import { motionOn } from './prefs';
import { track } from './analytics';

export function initPlayground(root: HTMLElement) {
  const started = new Set<string>();
  const start = (demo: string) => {
    if (started.has(demo)) return;
    started.add(demo);
    track('service_demo_start', { demo, location: 'playground' });
  };

  /* ── Before / after ── */
  const ba = root.querySelector<HTMLElement>('[data-ba]');
  const range = root.querySelector<HTMLInputElement>('[data-ba-range]');
  if (ba && range) {
    const set = (v: number) => {
      const n = Math.max(0, Math.min(100, Math.round(v)));
      range.value = String(n);
      ba.style.setProperty('--pos', `${n}%`);
      range.setAttribute(
        'aria-valuetext',
        n >= 98 ? 'Showing the before version' : n <= 2 ? 'Showing the after version' : `${n}% before, ${100 - n}% after`,
      );
      root.querySelectorAll<HTMLButtonElement>('[data-ba-set]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.baSet) === n)));
    };
    range.addEventListener('input', () => {
      set(Number(range.value));
      start('website');
    });
    root.querySelectorAll<HTMLButtonElement>('[data-ba-set]').forEach((b) =>
      b.addEventListener('click', () => {
        set(Number(b.dataset.baSet));
        start('website');
      }),
    );
    let dragging = false;
    // The images inside must not start the browser's own image drag (it steals the pointer).
    ba.addEventListener('dragstart', (e) => e.preventDefault());
    const fromPointer = (e: PointerEvent) => {
      const r = ba.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    ba.addEventListener('pointerdown', (e) => {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      fromPointer(e);
      start('website');
    });
    ba.addEventListener('pointermove', (e) => dragging && fromPointer(e));
    ba.addEventListener('pointerup', () => (dragging = false));
    ba.addEventListener('pointercancel', () => (dragging = false));
    set(50);
  }

  /* ── Journey ── */
  const jr = root.querySelector<HTMLElement>('[data-journey]');
  if (jr) {
    const steps = [...jr.querySelectorAll<HTMLButtonElement>('[data-jr-go]')];
    const track_ = jr.querySelector<HTMLElement>('.jr__track');
    const playBtn = jr.querySelector<HTMLButtonElement>('[data-jr-play]');
    const playLabel = jr.querySelector<HTMLElement>('[data-jr-play-label]');
    let at = 0;
    let timer = 0;
    const go = (i: number) => {
      at = (i + steps.length) % steps.length;
      jr.dataset.step = String(at);
      track_?.style.setProperty('--s', String(at));
      steps.forEach((s, j) => (j === at ? s.setAttribute('aria-current', 'step') : s.removeAttribute('aria-current')));
    };
    const stop = () => {
      clearInterval(timer);
      timer = 0;
      playBtn?.setAttribute('aria-pressed', 'false');
      if (playLabel) playLabel.textContent = 'Play the journey';
    };
    const play = () => {
      if (timer) return stop();
      if (at === steps.length - 1) go(0);
      playBtn?.setAttribute('aria-pressed', 'true');
      if (playLabel) playLabel.textContent = 'Pause';
      timer = window.setInterval(() => {
        if (at >= steps.length - 1) return stop();
        go(at + 1);
        if (at >= steps.length - 1) stop();
      }, 2600);
    };
    steps.forEach((s, i) =>
      s.addEventListener('click', () => {
        stop();
        go(i);
        start('found');
      }),
    );
    jr.querySelector('[data-jr-next]')?.addEventListener('click', () => {
      stop();
      go(at + 1);
      start('found');
    });
    playBtn?.addEventListener('click', () => {
      play();
      start('found');
    });
    new IntersectionObserver(([en]) => !en.isIntersecting && stop(), { threshold: 0.1 }).observe(jr);
    document.addEventListener('visibilitychange', () => document.hidden && stop());
    go(0);
  }

  /* ── Flow ── */
  const fl = root.querySelector<HTMLElement>('[data-flow]');
  if (fl) {
    const items = [...fl.querySelectorAll<HTMLElement>('[data-flow-item]')];
    const btn = fl.querySelector<HTMLButtonElement>('[data-flow-run]');
    const label = fl.querySelector<HTMLElement>('[data-flow-label]');
    const live = fl.querySelector<HTMLElement>('[data-flow-live]');
    let timers: number[] = [];
    // The connector under each dot reaches the next dot: measure the row height once laid out.
    const measure = () => items.forEach((it) => it.style.setProperty('--row', `${it.offsetHeight}px`));
    measure();
    new ResizeObserver(measure).observe(fl);
    const reset = () => {
      timers.forEach(clearTimeout);
      timers = [];
      items.forEach((it) => it.classList.remove('is-done'));
    };
    const run = () => {
      reset();
      start('admin');
      const gap = motionOn() ? 700 : 0;
      const said: string[] = [];
      items.forEach((it, i) => {
        timers.push(
          window.setTimeout(() => {
            it.classList.add('is-done');
            said.push(it.querySelector('.fl__t')?.textContent ?? '');
            if (live) live.textContent = said.join('. ') + '.';
            if (i === items.length - 1 && label) label.textContent = 'Replay the sample';
          }, gap * (i + 1)),
        );
      });
    };
    btn?.addEventListener('click', run);
  }

  /* ── Your pick ── */
  const mark = (need: string | null) => {
    root.querySelectorAll<HTMLElement>('[data-demo]').forEach((d) => d.toggleAttribute('data-picked', d.dataset.demo === need));
  };
  try {
    mark(sessionStorage.getItem('mp-need'));
  } catch {
    /* storage blocked */
  }
  addEventListener('needchange', (e) => mark((e as CustomEvent).detail?.need ?? null));

  /* ── Brief starts from the playground ── */
  root.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('[data-brief-start]');
    if (a) track('brief_start', { need: a.dataset.briefStart!, location: 'playground' });
  });
}
