import { test, expect, type Page } from '@playwright/test';

// MANN / IN MOTION (19 Nov 2026): the interactions the redesign added. DESIGN.md and MOTION.md describe them.

const motion = (page: Page) => page.evaluate(() => document.documentElement.getAttribute('data-motion'));

test.describe('stage (home hero)', () => {
  test('three needs: a real tablist that switches the scene by pointer and by keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const tabs = page.getByRole('tablist', { name: 'What do you need?' }).getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-scene', 'website');
    // Pointer
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-scene', 'found');
    await expect(page.locator('[data-stage]').getByRole('tabpanel')).toContainText('Get found, then chosen.');
    // Keyboard: arrows wrap, Home and End jump; focus follows and the panel changes with it.
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-scene', 'admin');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(0)).toBeFocused();
    await page.keyboard.press('End');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    // Only the chosen panel is shown; the others are hidden from everyone.
    await expect(page.locator('[data-stage] [role="tabpanel"]:not([hidden])')).toHaveCount(1);
  });

  test('the selected state changes in the same frame, and rapid clicks never block', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tab');
    for (let i = 0; i < 6; i++) await tabs.nth(i % 3).click();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    // No transition on the selected background: it is immediate.
    expect(await tabs.nth(2).evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(201, 246, 74)');
  });

  test('the line is measured from the real elements: from the headline full stop into the stage (wide screens)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1500);
    const d = await page.locator('[data-stage-path]').getAttribute('d');
    expect(d).toMatch(/^M0 [\d.]+ C/);
    const conn = await page.locator('[data-connector] path').getAttribute('d');
    expect(conn).toMatch(/^M[\d.]+ [\d.]+ C/);
    // The connector starts just right of the full stop and ends on the stage's left edge.
    const geo = await page.evaluate(() => {
      const stop = document.querySelector('[data-line-origin]')!.getBoundingClientRect();
      const screen = document.querySelector('[data-stage-screen]')!.getBoundingClientRect();
      const hero = document.querySelector('[data-hero]')!.getBoundingClientRect();
      return { stopRight: stop.right - hero.left, screenLeft: screen.left - hero.left };
    });
    const [, x1, , , , , , x2] = conn!.match(/M([\d.]+) ([\d.]+) C([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)/)!.map(Number);
    expect(Math.abs(x1 - geo.stopRight)).toBeLessThan(16);
    expect(Math.abs(x2 - geo.screenLeft)).toBeLessThan(2);
    // Each need re-routes the line through its own scene: more hops for the search and the enquiry.
    await page.getByRole('tab', { name: 'Automate my admin' }).click();
    const hops = (await page.locator('[data-stage-path]').getAttribute('d'))!.split('M').length - 1;
    expect(hops).toBe(4);
  });

  test('phones: the stage stacks under the copy, keeps 44px targets, and draws no connector', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/');
    for (const tab of await page.getByRole('tab').all()) expect((await tab.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(page.locator('[data-connector]')).toBeHidden();
  });

  test('replay restarts the scene; with Motion off there is nothing to replay', async ({ page }) => {
    await page.goto('/');
    if ((await motion(page)) !== 'on') test.skip();
    await page.getByRole('button', { name: /Replay/ }).first().click();
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-play', '');
  });
});

test.describe('playground', () => {
  test('before and after: the range input, the buttons and dragging all move the split', async ({ page }) => {
    await page.goto('/');
    const range = page.getByRole('slider', { name: /Compare before and after/ });
    await range.scrollIntoViewIfNeeded();
    await range.focus();
    await page.keyboard.press('End');
    await expect(range).toHaveAttribute('aria-valuetext', 'Showing the before version');
    await page.getByRole('button', { name: 'After', exact: true }).click();
    await expect(range).toHaveValue('0');
    const ba = page.locator('[data-ba]');
    const box = (await ba.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 4 });
    await page.mouse.up();
    expect(Number(await range.inputValue())).toBeGreaterThan(65);
    // Both images are real, dated captures with their own descriptions.
    await expect(ba.locator('img[alt^="Before, 31 October 2026"]')).toHaveCount(1);
    await expect(ba.locator('img[alt^="After, 8 November 2026"]')).toHaveCount(1);
  });

  test('journey: steps, Next and Play; Play stops by itself at the last step', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    const jr = page.locator('#playground [data-journey]');
    await jr.scrollIntoViewIfNeeded();
    await jr.getByRole('button', { name: /They land on the answer/ }).click();
    await expect(jr).toHaveAttribute('data-step', '2');
    await jr.getByRole('button', { name: /Next step/ }).click();
    await expect(jr).toHaveAttribute('data-step', '3');
    await jr.getByRole('button', { name: /Play the journey/ }).click();
    await expect(jr).toHaveAttribute('data-step', '0');
    await page.clock.runFor(2700 * 4);
    await expect(jr).toHaveAttribute('data-step', '3');
    await expect(jr.getByRole('button', { name: /Play the journey/ })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#demo-search')).toContainText('Illustration, not a real search result');
  });

  test('sample enquiry: runs locally through five steps, announces them, sends nothing, and replays', async ({ page }) => {
    const sent: string[] = [];
    page.on('request', (r) => r.method() === 'POST' && sent.push(r.url()));
    await page.goto('/');
    const fl = page.locator('[data-flow]');
    await fl.scrollIntoViewIfNeeded();
    await fl.getByRole('button', { name: 'Send a sample enquiry' }).click();
    await expect(fl.locator('.fl__item.is-done')).toHaveCount(5, { timeout: 6000 });
    await expect(fl.locator('[data-flow-live]')).toContainText('Follow-up scheduled');
    await expect(fl.getByRole('button', { name: 'Replay the sample' })).toBeVisible();
    await fl.getByRole('button', { name: 'Replay the sample' }).click();
    await expect(fl.locator('.fl__item.is-done')).toHaveCount(5, { timeout: 6000 });
    expect(sent).toEqual([]);
    await expect(page.locator('#demo-admin')).toContainText('Nothing is sent, booked or charged');
  });

  test('a need chosen on the stage marks its demo and pre-ticks the short brief', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Automate my admin' }).click();
    await expect(page.locator('#demo-admin')).toHaveAttribute('data-picked', '');
    await expect(page.locator('#start input[value="area-follow-up"]')).toBeChecked();
  });

  test('service pages carry their own working demonstration', async ({ page }) => {
    await page.goto('/services/web-design/');
    await expect(page.getByRole('slider', { name: /Compare before and after/ })).toBeAttached();
    await page.goto('/services/local-visibility/');
    await expect(page.locator('[data-journey]')).toBeAttached();
  });
});

test.describe('short brief hand-off', () => {
  test('the home brief hands its answers to the full brief on /contact/ (one enquiry pipeline)', async ({ page }) => {
    await page.goto('/');
    const brief = page.locator('[data-mini-brief]');
    await brief.scrollIntoViewIfNeeded();
    await brief.getByText('A better website').click();
    await brief.getByText('Getting found on Google').click();
    await brief.getByLabel(/Your website/).fill('example-salon.ca');
    await brief.getByRole('button', { name: 'Continue to the brief' }).click();
    await expect(page).toHaveURL(/\/contact\/\?services=area-website%2Carea-found&website=example-salon\.ca#brief/);
    await expect(page.locator('input[name="services"][value="area-website"]')).toBeChecked();
    await expect(page.locator('input[name="services"][value="area-found"]')).toBeChecked();
    await expect(page.locator('#f-website')).toHaveValue('example-salon.ca');
  });

  test('without JavaScript the short brief still lands on the full brief with its answers', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:4321' });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.locator('[data-mini-brief]').getByText('Less admin, faster replies').click();
    await page.locator('[data-mini-brief]').getByRole('button', { name: 'Continue to the brief' }).click();
    await expect(page).toHaveURL(/\/contact\/\?from=home&services=area-follow-up/);
    await ctx.close();
  });
});

test.describe('motion preference', () => {
  test('starts from the OS setting, and the Motion switch overrides it across reloads and pages', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    expect(await motion(page)).toBe('off');
    const sw = page.locator('footer [data-motion-toggle]');
    await expect(sw).toHaveAttribute('aria-pressed', 'false');
    await sw.click();
    await expect(sw).toHaveAttribute('aria-pressed', 'true');
    expect(await motion(page)).toBe('on');
    await page.reload();
    expect(await motion(page)).toBe('on');
    await page.goto('/services/');
    expect(await motion(page)).toBe('on');
    await page.locator('footer [data-motion-toggle]').click();
    await page.goto('/about/');
    expect(await motion(page)).toBe('off');
    // With Motion off every duration token is zero.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--dur-4').trim())).toMatch(/^0m?s$/);
    await ctx.close();
  });
});

test.describe('controls', () => {
  test('Back to top: hidden from everyone until you scroll, then returns to the top and moves focus up', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/services/');
    const btn = page.locator('[data-to-top]');
    await expect(btn).toBeHidden();
    await expect(page.getByRole('button', { name: 'Back to top' })).toHaveCount(0);
    await page.evaluate(() => scrollTo(0, 3000));
    await expect(btn).toBeVisible();
    expect((await btn.boundingBox())!.width).toBeGreaterThanOrEqual(44);
    await btn.click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
    await expect(page.locator('[data-header] a').first()).toBeFocused();
  });

  test('one floating control only: nothing else is fixed over the page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate(() => scrollTo(0, 2500));
    const fixed = await page.evaluate(() =>
      [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().height > 0 && !e.closest('dialog')).map((e) => e.className),
    );
    expect(fixed.filter((c) => !/dock|skip-link|consent/.test(String(c)))).toEqual([]);
  });

  test('the studio reel: poster first, nothing downloads until play, and a text description', async ({ page }) => {
    const media: string[] = [];
    page.on('request', (r) => /studio-reel\.(mp4|webm)/.test(r.url()) && media.push(r.url()));
    await page.goto('/work/');
    const fig = page.locator('[data-reel-player]');
    await expect(fig.locator('video')).toHaveAttribute('preload', 'none');
    await expect(fig.locator('video')).toHaveAttribute('poster', '/media/studio-reel-poster.jpg');
    await expect(fig.locator('#rp-desc')).toContainText('A screen recording of this website');
    await page.waitForTimeout(500);
    expect(media).toEqual([]);
    await fig.getByRole('button', { name: /Play the 20-second reel/ }).click();
    await expect.poll(() => media.length).toBeGreaterThan(0);
  });
});

test.describe('pages', () => {
  test('every page title carries the page line; ivory bands never use lime as text', async ({ page }) => {
    for (const path of ['/work/', '/services/', '/services/web-design/', '/about/', '/contact/', '/pricing/', '/guides/', '/privacy/']) {
      await page.goto(path);
      await expect(page.locator('main .pageline').first(), path).toBeVisible();
      const lime = await page.evaluate(() =>
        [...document.querySelectorAll('.paper *, .section--alt *')]
          .filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
          .filter((e) => getComputedStyle(e).color === 'rgb(201, 246, 74)')
          .map((e) => `${e.tagName}.${e.className}`),
      );
      expect(lime, path).toEqual([]);
    }
  });

  test('the 404 keeps the identity and offers the five real destinations', async ({ page }) => {
    const res = await page.goto('/nowhere-at-all/');
    expect(res?.status()).toBe(404);
    const nav = page.getByRole('navigation', { name: 'Pages that exist' });
    for (const href of ['/', '/work/', '/services/', '/about/', '/contact/']) await expect(nav.locator(`a[href="${href}"]`)).toHaveCount(1);
  });
});

test.describe('analytics event plan (logged with ?ga_debug=1; sent to GA4 only after consent)', () => {
  test('service_demo_start, project_open and brief_start fire once each at the right moment, with no personal data', async ({ page }) => {
    const events: string[] = [];
    page.on('console', (m) => {
      const t = m.text();
      if (t.startsWith('[analytics]')) events.push(t);
    });
    await page.goto('/?ga_debug=1');
    await page.getByRole('tab', { name: 'Help me get found' }).click();
    expect(events.filter((e) => e.includes('service_demo_start') && e.includes('found'))).toHaveLength(1);
    // Playground: the first interaction with a demo counts once, however many times it is used.
    const fl = page.locator('[data-flow]');
    await fl.scrollIntoViewIfNeeded();
    await fl.getByRole('button', { name: 'Send a sample enquiry' }).click();
    await fl.getByRole('button', { name: 'Send a sample enquiry' }).click();
    expect(events.filter((e) => e.includes('service_demo_start') && e.includes('admin') && e.includes('playground'))).toHaveLength(1);
    // The brief: what was chosen, never what was typed.
    const brief = page.locator('[data-mini-brief]');
    await brief.getByText('A better website').click();
    await brief.getByLabel(/Your website/).fill('private-example.ca');
    await Promise.all([page.waitForURL(/\/contact\//), brief.getByRole('button', { name: 'Continue to the brief' }).click()]);
    const start = events.filter((e) => e.includes('brief_start'));
    expect(start).toHaveLength(1);
    expect(start[0]).not.toContain('private-example');
    // Opening a project from the home reel.
    await page.goto('/?ga_debug=1');
    events.length = 0;
    await page.setViewportSize({ width: 1440, height: 900 });
    const cta = page.locator('[data-project-open="nest-and-rest-cleaning"]');
    await cta.scrollIntoViewIfNeeded();
    await Promise.all([page.waitForURL(/\/work\/nest-and-rest-cleaning\//), cta.click()]);
    expect(events.filter((e) => e.includes('project_open'))).toHaveLength(1);
  });
});
