---
name: wcag
description: "Web accessibility against WCAG 2.2: official text of every success criterion, audit of a page or flow (axe, keyboard walk, reflow, text spacing), contrast calculation and fixes. Use whenever a request touches accessibility, even without the word WCAG: low contrast or hard-to-read text, a11y, screen readers, VoiceOver, TalkBack, keyboard navigation, focus, ARIA, aria-label, zoom, reflow, target size, high-contrast or forced-colors mode, Lighthouse accessibility score, axe, conformance, accessibility statements. Also use when creating or changing an interactive component, a theme or a palette, so they stay accessible. Do not use for page speed, SEO or a plain functional test with no accessibility concern."
license: MIT for the skill and scripts, W3C Document License for references/success-criteria.md, glossary.md and conformance.md
compatibility: "audit.mjs needs Node 20+ and a Chromium that Playwright can install. contrast.py and build_references.py need Python 3 only."
---

# WCAG 2.2

Four rules drive everything else, because each one has already prevented or caused a real mistake.

**A tool never proves conformance.** Of the 55 A and AA criteria, axe has rules for 23, and often for a small part of the criterion: its 1.4.1 rule only looks at links in text. Conformance covers every criterion, the full page, each of its screen variants and every page of a process (`references/conformance.md`). So write "axe detects no violation on these states", never "conformant" unless every criterion was evaluated.

**Test states, not the load.** Lighthouse and axe only see what is on screen. One page scored 96 in Lighthouse with 4 axe violations, and 43 in its other theme, invisible on load. List the states first: theme, open drawer, error, results, each screen size.

**An empty result is not proof.** An axe rule that crashes ends up in `incomplete` with no violation: on one page, the contrast rule crashed as soon as map tiles loaded. `incomplete` cases do not count in scores either: a button at 4.12:1 sat on a page Lighthouse rated 100. Read them one by one. Invisible content gives no result at all: a page stuck at `opacity: 0` came back with no contrast finding.

**Cite the criterion, not your memory.** Each defect points to a number and its text. Read it before concluding, because the exceptions often decide: a logotype has no contrast requirement, two states that do not touch need not contrast with each other, and a ratio is not rounded (4.499:1 fails 4.5:1).

## Resources

| Need | Where |
|---|---|
| Exact text of a criterion | `grep -n "^#### 1.4.3 " references/success-criteria.md`, then read about 25 lines |
| Definition of a term in *italics* | `grep -n -i "^### large scale" references/glossary.md` |
| Levels, full pages, processes, statements | `references/conformance.md` |
| How to test each A and AA criterion | `references/test-matrix.md` |
| Contrast ratio, smallest fix | `python3 scripts/contrast.py` |
| Automatic audit of a URL | `node scripts/audit.mjs` |
| Understanding a criterion in depth | Understanding link under each criterion. These are W3C explanations, not normative |

Paths start from this skill's folder. The text is the W3C Recommendation of 12 December 2024. The Editor's Draft words 6 criteria differently, listed at the top of `success-criteria.md`: same criteria and levels.

**Target level**: AA by default, meaning all A and AA criteria. AAA only on request: the W3C advises against requiring it for a whole site, since some content cannot satisfy all of it.

**First run of the audit script:**

```bash
cd scripts && npm install && npx playwright install chromium
```

## Audit a page or flow

1. **Set the scope.** Pages, complete process, states, screen sizes. Read the project's instructions (`CLAUDE.md`, `AGENTS.md`, README) for how to start it, and its CSS media queries for the sizes to cover. If a state needs mocked network or a login, write it in a Playwright spec with `AxeBuilder` rather than in the script. Prefer a local server over production.

2. **Run the script** on each page:

   ```bash
   node scripts/audit.mjs http://localhost:3000/pricing \
     --state 'dark=#theme-toggle' --state 'menu=#menu-button' \
     --block 'google-analytics|googletagmanager|ingest\.[a-z.]*sentry\.io'
   ```

   It runs axe per state and size, checks reflow at 320 px and text spacing, walks the page with Tab at every size, and produces forced-colours and greyscale screenshots. A state starts from a fresh load and clicks its selectors in order, so a cookie banner gets its own state: audit the page with the banner and with it dismissed. Read its lines like this:

   - `VIOLATION`: defect detected by axe, to check against the criterion's text.
   - `AXE RULE DID NOT RUN`: no result for that rule, deal with it before concluding anything.
   - `PAGE HIDDEN`: most of the text was invisible when axe ran, so its result is worthless. Usually `--block` stopped a script the page needs. Fix that first.
   - `to check by hand`: axe could not decide, and the reason follows in brackets. Measure or judge each case.
   - `suspect`: a lead to confirm, not a defect. Some will be wrong: say so rather than copy them. An element past the right edge with no horizontal scroll is often a closed drawer.
   - `note`: allowed by itself, worth a look.

3. **Look at the screenshots.** What the script cannot judge often shows there: state lost in grey, a control gone in forced colours.

4. **Go through `references/test-matrix.md`** for everything neither automatic nor not applicable. Most of the work is here, and it is what separates an audit from a score. On the W3C's deliberately broken demo, the script alone flags about half of the failed criteria (see the README's benchmark): page titles, fake headings, unlabelled fields and context changes all wait for this step.

5. **Ask for what a tool cannot do.** VoiceOver, TalkBack, voice control and real zoom need a person. Give the user a short protocol, with the phrases to listen for and the expected answer, then wait for their reply instead of concluding.

6. **Write the report** using the template below, in the user's language.

## Fix

- **Start from native HTML.** A real `button` brings the role, keyboard and focus. ARIA is for when native is not enough, and bad ARIA is worse than none.
- **Compute the smallest fix**, on every surface and in every theme, so the design survives:

  ```bash
  python3 scripts/contrast.py '#8d5ba3' '#f6f0d4' '#fffaf0' --fix 4.5
  python3 scripts/contrast.py 'rgba(216,219,200,.62)' '#161b12' --opacity 0.6 --under '#0e120a'
  ```

- **Look at the result**, in each state and during transitions. A green test says nothing about lost emphasis or broken rendering.
- **Leave a guard.** An axe test per state that also fails when a rule crashes (`incomplete.filter(r => r.error)`), and check that it fails on the old defect.
- **Tell the user what changes for their users**: component behaviour, bold text, a brand colour.

## Known pitfalls

| Pitfall | Why | Do instead |
|---|---|---|
| `opacity` on a block with text | Lowers the contrast of all its content. Axe approximates it: 2.68:1 announced, 2.75:1 on rendered pixels. `contrast.py` follows the pixels | Fade the background and graphics, keep text that passes |
| Closed drawer moved off screen with `transform` | Its controls stay in the Tab order: one page had 21 invisible stops | `inert` or `visibility: hidden` while closed |
| Script that removes focus (`onfocus="blur()"`) | Keyboard users lose their place, and a walk that stops at the body undercounts the page | Remove the script. An old anti-outline trick |
| Single-character label (`i`, `×`) | Axe does not judge it (`shortTextContent`), so the score does not count it | Measure with `contrast.py` |
| `mix-blend-mode: plus-lighter` (map tiles, Leaflet) | Crashes axe's contrast rule, with no visible violation | `audit.mjs` neutralises it. In a spec, check `incomplete.filter(r => r.error)` |
| Transition to `transparent` | The final colour applies on the first frame and only alpha animates: the background runs ahead of the page | Transition between two opaque colours |
| Audit during a transition | False defects on intermediate colours | Disable transitions before axe, as `audit.mjs` does |
| `aria-label` replacing visible text | Fails 2.5.3: voice control users say what they see | Visible text in the name, at the start |
| Toggle with two visible labels | One name cannot clearly hold both | Two buttons with `aria-pressed` |
| Emphasis by colour alone (`strong` with `font-weight: normal`) | Fails 1.4.1 if the two colours are under 3:1 from each other | Add weight or another signal |
| Low-contrast state indicator | 1.4.11 covers states and focus, not only text | 3:1 against adjacent colours |
| Browser focus ring on a dark background | `#005fcc` drops to 2.92:1 on a dark card | Explicit `outline` in the text colour |
| Background removed in forced colours | An indicator made of `background` disappears | `border: 1.5px solid transparent`, which that mode makes visible |
| `list-style: none` | WebKit can drop list semantics. Browser behaviour, not a WCAG requirement | `role="list"`, to confirm with VoiceOver |
| Blocking what the page needs in an audit | Blocking an error-reporting SDK by name left a whole page at `opacity: 0`. A map's loading screen stayed up without its tiles and covered the controls | Block where data is sent (`ingest.sentry.io`), not the library. Read the `Stopped by --block` line: what is listed was not audited, say so |
| Link inside a link | The HTML parser closes the outer one: an empty link and an extra Tab stop appear, which axe reports as `link-name` | One link. Check the template, not only the DOM |

## Report template

WCAG defines no severity, and its A, AA or AAA level is not one. Use this scale, and say so: **blocker**, a task is impossible (keyboard trap, essential control with no name); **major**, a task is painful or information is lost; **minor**, annoyance with no loss.

```markdown
# Accessibility: <page or flow>, <date>

WCAG 2.2 AA. <browser>, axe <version>. States: <list>. Sizes: <list>.

**Result.** <One or two sentences. Never "conformant" unless every criterion was evaluated.>

## Defects
| Severity | Criterion | Where, in which state | Measure | Fix |

## Coverage
- **Tested automatically:** ...
- **Checked by review:** ...
- **Not applicable:** ...
- **Not tested:** ...
- **For a person to do:** ...
```

The Coverage section is not optional: without it, a short report reads like a reassuring one.

## Updating

The references are regenerated from the two documents, which are downloaded data. Put them in a separate folder and run with `-I`:

```bash
python3 -I scripts/build_references.py recommendation.html draft.html references
```

`test-matrix.md` and the number of criteria axe covers are written by hand: review them if the specification or the axe version changes.
