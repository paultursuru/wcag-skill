#!/usr/bin/env node
// What a tool can check on a page, in every state and at every size. Zero
// findings does not mean conformant: see references/test-matrix.md for the rest.
//
// Options: --help.
// A state is reached from a fresh load by clicking its selectors in order. A state
// that needs mocked network or a login belongs in a Playwright spec instead. Run
// npm install in this folder first. Exit code 1 means axe found a WCAG violation or
// a rule crashed; "suspect" lines are leads to confirm by hand.
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const NO_MOTION = '*, *::before, *::after { transition: none !important; animation: none !important; }';
const TEXT_SPACING = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
const INTERACTIVE = 'a[href], area[href], button, input:not([type=hidden]), select, textarea, summary, [contenteditable=true], [tabindex]:not([tabindex="-1"]), [role=button], [role=link], [role=tab], [role=switch], [role=checkbox], [role=radio], [role=slider], [role=menuitem], [role=combobox], [role=option]';
// What axe's contrast rule can compute. It crashes on any other mix-blend-mode, such as plus-lighter.
const AXE_BLEND_MODES = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
const FOCUS_PROPS = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'backgroundColor', 'borderTopColor', 'borderTopWidth', 'color', 'textDecorationLine'];

const USAGE = `node audit.mjs URL [--state name=selector[&&selector]]... [--viewport WxH]... [--block regex] [--out dir]
  --state     reached from a fresh load by clicking the selectors in order. "initial" always runs.
  --viewport  default 1280x800 and 390x844. Reflow (320 px) and 200% zoom always run.
  --block     regex of request URLs to abort (analytics, error reporting endpoints).
  --out       screenshot folder, default under the system temp folder.
Exit code 1: axe found a WCAG violation, a rule crashed or the page stayed hidden.`;

// Lines of the current state, held back so a state only prints what no earlier state printed.
let buffer = null;
const out = line => (buffer ? buffer.push(line) : console.log(line));
const versions = {};

function parseArgs(argv) {
  const opts = { url: null, states: [{ name: 'initial', clicks: [] }], viewports: [], out: null, block: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--state') {
      const raw = argv[++i];
      const cut = raw.indexOf('=');
      opts.states.push({ name: raw.slice(0, cut), clicks: raw.slice(cut + 1).split('&&').map(s => s.trim()) });
    } else if (arg === '--viewport') {
      const [width, height] = argv[++i].split('x').map(Number);
      opts.viewports.push({ width, height });
    } else if (arg === '--out') opts.out = argv[++i];
    else if (arg === '--block') opts.block = new RegExp(argv[++i]);
    else if (arg === '--help' || arg === '-h') { console.log(USAGE); process.exit(0); }
    else opts.url = arg;
  }
  if (!opts.url) { console.error(USAGE); process.exit(2); }
  if (!opts.viewports.length) opts.viewports = [{ width: 1280, height: 800 }, { width: 390, height: 844 }];
  // Outside the audited project, so a run never adds files to its repository.
  opts.out ??= join(tmpdir(), 'wcag-audit', opts.url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]+/g, '-'));
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
const browser = await chromium.launch({ args: ['--no-sandbox'] });
mkdirSync(opts.out, { recursive: true });
const sizeName = v => `${v.width}x${v.height}`;
const failures = [];

const blocked = new Set();
async function applyBlock(page) {
  if (!opts.block) return;
  await page.route(opts.block, (route) => {
    blocked.add(route.request().url().slice(0, 80));
    return route.abort();
  });
}

const hiddenText = () => {
  const texts = [...document.body.querySelectorAll('*')].filter(el => el.getClientRects().length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  const hidden = texts.filter((el) => {
    for (let node = el; node; node = node.parentElement) if (getComputedStyle(node).opacity === '0') return true;
    return false;
  });
  return { hidden: hidden.length, total: texts.length };
};

// Axe skips what is invisible, so a page still fading in looks clean, and so does one stuck hidden.
async function reveal(page) {
  for (let tries = 0; tries < 10; tries++) {
    const { hidden, total } = await page.evaluate(hiddenText);
    if (hidden * 2 <= total) break;
    await page.waitForTimeout(300);
  }
  if (!(await page.evaluate(hiddenText)).hidden) return;
  // Content revealed on scroll only appears once it has been in view.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

async function open(state, viewport, contextOptions = {}) {
  const context = await browser.newContext({ viewport, bypassCSP: true, serviceWorkers: 'block', reducedMotion: 'reduce', ...contextOptions });
  const page = await context.newPage();
  await applyBlock(page);
  await page.goto(opts.url, { waitUntil: 'load' });
  // Colours caught mid-transition would fail for the wrong reason.
  await page.addStyleTag({ content: NO_MOTION });
  await reveal(page);
  for (const selector of state.clicks) await page.locator(selector).first().click();
  await page.waitForTimeout(300);
  return page;
}

const criteriaOf = tags => tags.map(t => t.match(/^wcag(\d)(\d)(\d+)$/)).filter(Boolean).map(m => `${m[1]}.${m[2]}.${m[3]}`).join(', ');

function describeNode(node) {
  const data = node.any?.[0]?.data;
  const measured = data?.contrastRatio ? `  ${data.contrastRatio}:1, ${data.fgColor} on ${data.bgColor}, ${data.fontSize}` : '';
  const reason = data?.messageKey ? `  (${data.messageKey})` : '';
  return `${node.target.join(' ')}${measured}${reason}`;
}

async function runAxe(state) {
  const groups = new Map();
  const add = (key, entry, size) => {
    const group = groups.get(key) ?? { ...entry, nodes: new Map() };
    for (const node of entry.rawNodes) {
      const text = describeNode(node);
      group.nodes.set(text, [...(group.nodes.get(text) ?? []), size]);
    }
    groups.set(key, group);
  };
  const notes = new Map();
  for (const viewport of opts.viewports) {
    const page = await open(state, viewport);
    const { hidden, total } = await page.evaluate(hiddenText);
    if (hidden * 2 > total) {
      failures.push('page hidden');
      out(`  PAGE HIDDEN at ${sizeName(viewport)}: ${hidden} of ${total} text elements at opacity 0. Axe skips them, so its result says nothing about them. Did --block stop a script the page needs?`);
    } else if (hidden) out(`  note: ${hidden} of ${total} text elements still at opacity 0 at ${sizeName(viewport)}. Axe did not check them.`);
    const neutralised = await page.evaluate((known) => {
      const hits = [...document.querySelectorAll('*')].filter(el => !known.includes(getComputedStyle(el).mixBlendMode));
      const modes = [...new Set(hits.map(el => getComputedStyle(el).mixBlendMode))];
      hits.forEach(el => el.style.setProperty('mix-blend-mode', 'normal', 'important'));
      return { count: hits.length, modes };
    }, AXE_BLEND_MODES);
    if (neutralised.count) {
      const note = `  note: ${neutralised.count} elements with mix-blend-mode ${neutralised.modes.join(', ')} set to normal for this run. Left as is, axe's color-contrast rule crashes and reports nothing: say so in the report, the site's own axe tests are affected`;
      notes.set(note, [...(notes.get(note) ?? []), sizeName(viewport)]);
    }
    const results = await new AxeBuilder({ page }).withTags([...WCAG_TAGS, 'best-practice']).analyze();
    versions.axe = results.testEngine.version;
    // A rule that crashes lands in "incomplete" and looks like nothing was found.
    for (const v of results.incomplete.filter(r => r.error)) {
      failures.push(`${v.id} (did not run)`);
      out(`  AXE RULE DID NOT RUN: ${v.id}: ${v.error.message}`);
    }
    results.incomplete = results.incomplete.filter(r => !r.error);
    for (const v of results.violations) {
      const kind = v.tags.some(t => WCAG_TAGS.includes(t)) ? 'VIOLATION' : 'best practice (not WCAG)';
      if (kind === 'VIOLATION') failures.push(v.id);
      add(`${kind}|${v.id}`, { kind, id: v.id, sc: criteriaOf(v.tags), help: v.help, rawNodes: v.nodes }, sizeName(viewport));
    }
    for (const v of results.incomplete) {
      add(`to check by hand|${v.id}`, { kind: 'to check by hand', id: v.id, sc: criteriaOf(v.tags), help: v.help, rawNodes: v.nodes }, sizeName(viewport));
    }
    await page.screenshot({ path: join(opts.out, `${state.name}-${sizeName(viewport)}.png`), fullPage: true });
    await page.context().close();
  }
  const sized = sizes => (sizes.length < opts.viewports.length ? `  [${sizes.join(', ')}]` : '');
  for (const [note, sizes] of notes) out(`${note}${sized(sizes)}`);
  if (!groups.size) out('  axe: nothing found');
  for (const g of groups.values()) {
    const all = [...g.nodes.entries()];
    const lines = [`  ${g.kind}: ${g.id}${g.sc ? ` (${g.sc})` : ''}: ${g.help}`];
    for (const [text, sizes] of all.slice(0, 10)) lines.push(`      ${text}${sized(sizes)}`);
    if (all.length > 10) lines.push(`      ... and ${all.length - 10} more`);
    out(lines.join('\n'));
  }
}

const layoutProbe = () => {
  const root = document.documentElement;
  const width = root.clientWidth;
  const label = el => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : ''}`;
  const live = [...document.body.querySelectorAll('*')].filter(el => {
    if (el.closest('svg, [inert]')) return false;
    const style = getComputedStyle(el);
    const box = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 1 && box.height > 1;
  });
  const hasText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  return {
    width,
    scrollWidth: root.scrollWidth,
    beyond: live.filter(el => (hasText(el) || el.matches('button, a, input, select, textarea')) && el.getBoundingClientRect().right > width + 1).slice(0, 5).map(label),
    clipped: live.filter(el => {
      const style = getComputedStyle(el);
      return /hidden|clip/.test(style.overflowX + style.overflowY) && el.textContent.trim()
        && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    }).map(label),
  };
};

// 1.4.10 at 320 px, 1.4.4 at half the first viewport (same layout as a 200% zoom), 1.4.12 at both.
async function runLayout(state) {
  const first = opts.viewports[0];
  const checks = [
    { sc: '1.4.4', viewport: { width: Math.round(first.width / 2), height: Math.round(first.height / 2) } },
    { sc: '1.4.10', viewport: { width: 320, height: 640 } },
  ];
  for (const { sc, viewport } of checks) {
    const page = await open(state, viewport);
    const plain = await page.evaluate(layoutProbe);
    const overflow = plain.scrollWidth > plain.width;
    // 1.4.4 asks for no loss of content or function: content reached by scrolling is not lost.
    if (overflow && sc === '1.4.4') out(`  note 1.4.4: horizontal scroll at ${viewport.width} px (${plain.scrollWidth} wide). Allowed unless content or function is lost.`);
    else if (overflow) out(`  suspect ${sc}: horizontal scroll at ${viewport.width} px (${plain.scrollWidth} wide): ${plain.beyond.join(', ')}`);
    else if (plain.beyond.length) out(`  suspect ${sc}: text or control past the right edge at ${viewport.width} px: ${plain.beyond.join(', ')}`);
    await page.addStyleTag({ content: TEXT_SPACING });
    const spaced = await page.evaluate(layoutProbe);
    const newlyClipped = spaced.clipped.filter(c => !plain.clipped.includes(c));
    if (!overflow && spaced.scrollWidth > spaced.width) out(`  suspect 1.4.12: horizontal scroll with text spacing at ${viewport.width} px: ${spaced.beyond.join(', ')}`);
    if (newlyClipped.length) out(`  suspect 1.4.12: text clipped with text spacing at ${viewport.width} px: ${[...new Set(newlyClipped)].slice(0, 6).join(', ')}`);
    if (viewport.width === 320) await page.screenshot({ path: join(opts.out, `${state.name}-320-text-spacing.png`), fullPage: true });
    await page.context().close();
  }
}

// 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11, 3.2.1: walk the page with Tab, at every size.
// A menu closed off screen on a phone may not exist at all on a desktop.
async function runKeyboard(state) {
  const seen = new Map();
  for (const viewport of opts.viewports) {
    const say = line => seen.set(line, [...(seen.get(line) ?? []), sizeName(viewport)]);
    await walkKeyboard(state, viewport, say, viewport === opts.viewports[0]);
  }
  for (const [line, sizes] of seen) out(`${line}${sizes.length < opts.viewports.length ? `  [${sizes.join(', ')}]` : ''}`);
}

async function walkKeyboard(state, viewport, say, printOrder) {
  const page = await open(state, viewport);
  const startUrl = page.url();
  await page.evaluate((props) => {
    window.__rest = new WeakMap();
    window.__reached = new WeakSet();
    const snap = el => props.map(p => getComputedStyle(el)[p]).join('|');
    document.querySelectorAll('*').forEach(el => window.__rest.set(el, snap(el)));
    // Tab starts from the last click. Move that point back to the top of the page.
    const start = document.createElement('span');
    start.id = '__start';
    start.tabIndex = -1;
    document.body.prepend(start);
    start.focus();
    // Capture runs before an inline onfocus="blur()", which would hide that this stop was reached.
    document.addEventListener('focus', event => { window.__received = event.target; }, true);
  }, FOCUS_PROPS);

  const order = [];
  let trap = null;
  for (let i = 0; i < 250; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((props) => {
      document.getElementById('__start')?.remove();
      const received = window.__received;
      window.__received = null;
      const active = document.activeElement;
      const atBody = !active || active === document.body || active === document.documentElement;
      // Focus on the body means the end of the page, unless a stop just took focus and gave it up.
      if (atBody && !received) return { done: true };
      const el = atBody ? received : active;
      // Tab moves inside a frame while the page still sees the frame as active: not a loop, unless it never leaves.
      if (el.tagName === 'IFRAME' && el === window.__previous) {
        window.__insideFrame = (window.__insideFrame ?? 0) + 1;
        if (window.__insideFrame < 60) return { inFrame: true };
      }
      if (window.__reached.has(el)) return { done: true, again: el === window.__first ? 'first' : 'other' };
      window.__insideFrame = 0;
      window.__previous = el;
      window.__first ??= el;
      window.__reached.add(el);
      const label = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
      if (atBody) return { tag: el.tagName.toLowerCase(), id: el.id, cls, text: label, role: el.getAttribute('role'), lost: true };
      const snap = node => props.map(p => getComputedStyle(node)[p]).join('|');
      const changed = window.__rest.get(el) !== snap(el) || (el.parentElement && window.__rest.get(el.parentElement) !== snap(el.parentElement));
      const box = el.getBoundingClientRect();
      const points = [[0.5, 0.5], [0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]].map(([x, y]) => [box.left + box.width * x, box.top + box.height * y]);
      const visible = points.some(([x, y]) => {
        const hit = document.elementFromPoint(x, y);
        return hit && (hit === el || el.contains(hit) || hit.contains(el));
      });
      const offScreen = box.right <= 0 || box.left >= innerWidth || box.bottom <= 0 || box.top >= innerHeight;
      const cover = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      const coverName = cover ? `${cover.tagName.toLowerCase()}${cover.id ? `#${cover.id}` : ''}` : 'something';
      const hiddenBy = visible ? null : offScreen ? 'off screen when focused' : `covered by ${coverName}`;
      return { tag: el.tagName.toLowerCase(), id: el.id, cls, text: label, changed, hiddenBy, role: el.getAttribute('role') };
    }, FOCUS_PROPS);
    if (stop.inFrame) continue;
    if (stop.done) { if (stop.again === 'other') trap = order.at(-1); break; }
    order.push(stop);
    if (page.url() !== startUrl) { say(`  suspect 3.2.1: focus changed the URL to ${page.url()}`); break; }
  }
  const name = o => `${o.tag}${o.id ? `#${o.id}` : o.cls ? `.${o.cls}` : ''}${o.role ? `[${o.role}]` : ''} "${o.text}"`;
  if (printOrder) {
    const listed = order.slice(0, 45).map((o, i) => `${i + 1} ${name(o)}`).join(' | ');
    out(`  Tab order at ${sizeName(viewport)} (2.4.3: does it follow the meaning?), ${order.length} stops: ${listed}${order.length > 45 ? ` | ... and ${order.length - 45} more` : ''}`);
  } else out(`  Tab order at ${sizeName(viewport)}: ${order.length} stops`);
  if (trap) say(`  suspect 2.1.2: focus loops back without leaving, after ${name(trap)}`);
  const report = (criteria, reason, stops) => {
    const span = stops.length > 1 ? `${stops.length} stops (${stops[0].i} to ${stops.at(-1).i})` : `stop ${stops[0].i}`;
    say(`  suspect ${criteria}: ${reason}, ${span}: ${stops.slice(0, 5).map(s => name(s.o)).join(', ')}${stops.length > 5 ? ', ...' : ''}`);
  };
  const stops = order.map((o, n) => ({ o, i: n + 1 }));
  const lost = stops.filter(s => s.o.lost);
  if (lost.length) report('2.1.1 + 2.4.7 + 3.2.1', 'script removes focus as soon as it arrives', lost);
  const unchanged = stops.filter(s => !s.o.lost && !s.o.changed && !s.o.hiddenBy);
  if (unchanged.length) report('2.4.7', 'no visible style change on focus', unchanged);
  for (const reason of new Set(stops.map(s => s.o.hiddenBy).filter(Boolean))) {
    report(reason.startsWith('off') ? '2.4.7 + 2.4.11' : '2.4.11', reason, stops.filter(s => s.o.hiddenBy === reason));
  }
  const gaps = await page.evaluate((interactive) => {
    const cls = el => (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/)[0]}` : '');
    const label = el => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : cls(el)} "${(el.getAttribute('aria-label') || el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)}"`;
    const shown = el => {
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return !el.closest('[inert]') && style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
    };
    // Only one radio and one tab of a set takes Tab, the others use the arrows.
    const roving = el => el.matches('[type=radio], [role=radio], [role=tab], [role=option], [role=menuitem]');
    const unreached = [...document.querySelectorAll(interactive)]
      .filter(el => shown(el) && !el.disabled && el.getAttribute('aria-disabled') !== 'true' && !window.__reached.has(el) && !roving(el))
      .map(label);
    const fake = [...document.body.querySelectorAll('*')]
      .filter(el => shown(el) && !el.closest(interactive) && !el.closest('label') && !el.querySelector(interactive)
        && getComputedStyle(el).cursor === 'pointer' && (!el.parentElement || getComputedStyle(el.parentElement).cursor !== 'pointer'))
      .map(label);
    return { unreached, fake };
  }, INTERACTIVE);
  const tally = list => [...list.reduce((counts, g) => counts.set(g, (counts.get(g) ?? 0) + 1), new Map())].map(([g, n]) => (n > 1 ? `${g} (x${n})` : g));
  tally(gaps.unreached).slice(0, 10).forEach(g => say(`  suspect 2.1.1: interactive but never reached with Tab: ${g}`));
  tally(gaps.fake).slice(0, 10).forEach(g => say(`  suspect 2.1.1 + 4.1.2: clickable look (cursor: pointer) with no interactive role and no keyboard access: ${g}`));
  await page.context().close();
}

// Pictures for the eye: state lost without colour (1.4.1), controls lost in forced colours.
async function runPictures(state) {
  const viewport = opts.viewports[0];
  const forced = await open(state, viewport, { forcedColors: 'active', colorScheme: 'dark' });
  await forced.screenshot({ path: join(opts.out, `${state.name}-forced-colors.png`), fullPage: true });
  await forced.context().close();
  const grey = await open(state, viewport);
  await grey.addStyleTag({ content: 'html { filter: grayscale(1); }' });
  await grey.screenshot({ path: join(opts.out, `${state.name}-grayscale.png`), fullPage: true });
  await grey.context().close();
}

// A cold Vite server reloads the page once its dependencies are optimised, which would kill a run.
const warmUp = await (await browser.newContext({ serviceWorkers: 'block' })).newPage();
await applyBlock(warmUp);
await warmUp.goto(opts.url, { waitUntil: 'load' }).catch(() => {});
await warmUp.waitForTimeout(3000);
await warmUp.context().close();

const printed = new Map();
for (const state of opts.states) {
  console.log(`\n=== State "${state.name}"${state.clicks.length ? ` (${state.clicks.join(' then ')})` : ''}`);
  buffer = [];
  await runAxe(state);
  await runLayout(state);
  await runKeyboard(state);
  await runPictures(state);
  const items = buffer;
  buffer = null;
  items.filter(item => !printed.has(item)).forEach(item => console.log(item));
  // The first words of a line are enough to find it under the earlier state.
  const short = item => item.trim().split('\n')[0].split(':').slice(0, 2).join(':').slice(0, 48);
  const earlier = new Map();
  for (const item of items.filter(i => printed.has(i))) earlier.set(printed.get(item), [...(earlier.get(printed.get(item)) ?? []), short(item)]);
  for (const [name, labels] of earlier) console.log(`  Also here, exactly as under "${name}": ${labels.join('; ')}`);
  for (const item of items) if (!printed.has(item)) printed.set(item, state.name);
}
versions.browser = `Chromium ${browser.version()}`;
await browser.close();

if (blocked.size) console.log(`\nStopped by --block, so not audited: ${[...blocked].join(', ')}`);
console.log(`\n${versions.browser}, axe-core ${versions.axe}.`);
console.log(`Screenshots in ${opts.out}, named <state>-<what>.png: -forced-colors and -grayscale are worth opening (control gone, state lost without colour), -320-text-spacing and the full pages per size only to settle a finding.`);
console.log(`Axe WCAG violations or crashed rules: ${failures.length ? [...new Set(failures)].join(', ') : 'none'}. This is not a conformance result.`);
process.exit(failures.length ? 1 : 0);
