---
name: wcag
description: "WCAG 2.2 web accessibility: audit of a page or flow (axe per state, keyboard walk, reflow, text spacing), official text of each criterion, contrast calculation and fixes. Use for any accessibility request, even without the word WCAG: low contrast or hard-to-read text, a11y, screen readers, VoiceOver, TalkBack, keyboard, focus, ARIA, zoom, reflow, target size, forced colors, Lighthouse accessibility score, axe, conformance, accessibility statements. Also use when creating or changing an interactive component, theme or palette. Not for page speed, SEO or plain functional tests."
license: MIT for the skill and scripts, W3C Document License for references/success-criteria.md, glossary.md and conformance.md
compatibility: "audit.mjs needs Node 20+ and a Chromium that Playwright can install. contrast.py and sc.py need Python 3 only."
---

# WCAG 2.2

Target: all A and AA criteria. AAA only on request. Paths start from this folder. Run the scripts without reading their source: `--help` lists the options.

## Rules

- **A tool never proves conformance.** Axe has rules for 23 of the 55 A and AA criteria, often for a small part of each. Write "axe detects no violation in these states", never "conformant" unless every criterion was evaluated, on every page of the process (`references/conformance.md`).
- **Test states, not the load.** Tools only see what is on screen: one page scored 96 in Lighthouse, and 43 in its other theme. List the states first: theme, open menu, error, results, each screen size.
- **An empty result is not proof.** A crashed axe rule and a page stuck at `opacity: 0` both come back clean, and `incomplete` cases count in no score. Read each one.
- **Cite the text, not your memory.** For each defect you report, read its criterion: `python3 scripts/sc.py 1.4.3 2.4.11` (a term: `sc.py "large scale"`). The exceptions often decide: a logotype has no contrast requirement, and a ratio is not rounded (4.499:1 fails 4.5:1).

## Audit

1. **Scope.** Pages, states, screen sizes. The project's instructions say how to start it, its CSS media queries give the sizes. Prefer a local server over production.
2. **Run the script** on each page, all states in one run:

   ```bash
   node scripts/audit.mjs http://localhost:3000/pricing --state 'dark=#theme-toggle' \
     --state 'menu=#menu-button' --block 'google-analytics|ingest\.[a-z.]*sentry\.io'
   ```

   First time: `cd scripts && npm install && npx playwright install chromium`. A state is a fresh load plus clicks on its selectors, so a cookie banner gets a state with it dismissed. A login or mocked network goes in a Playwright spec with `AxeBuilder` instead. Use `--block` on where data is sent, never on a library the page needs. Its lines:

   - `VIOLATION`: found by axe. Check it against the criterion.
   - `AXE RULE DID NOT RUN`, `PAGE HIDDEN`: the result is worthless until this is fixed.
   - `to check by hand`: axe could not decide, the reason is in brackets. Measure or judge each case.
   - `suspect`: a lead, sometimes wrong. Confirm it or say it is wrong. An element past the right edge with no horizontal scroll is often a closed drawer.
   - `note`: allowed, worth a look. `Stopped by --block`: not audited, say so.
3. **Open the `-forced-colors` and `-grayscale` screenshots.** A control gone or a state lost without colour shows there. Open another screenshot only to settle a finding.
4. **Read `references/test-matrix.md` once and check each line that applies.** Most defects wait here: on the W3C's broken demo the script alone flags half of the failed criteria.
5. **Leave to a person** what needs VoiceOver, TalkBack, voice control or real zoom: give a short protocol with what to do and what to expect, and do not conclude for them.
6. **Report** in the user's language:

   ```markdown
   # Accessibility: <page or flow>, <date>
   WCAG 2.2 AA. <browser>, axe <version>. States: <list>. Sizes: <list>.
   **Result.** <One or two sentences.>
   ## Defects
   | Severity | Criterion | Where, in which state | Measure | Fix |
   ## Coverage
   Tested automatically: ... Checked by review: ... Not applicable: ... Not tested: ... For a person: ...
   ```

   Severity is not a WCAG notion, say so: **blocker**, a task is impossible; **major**, a task is painful or information is lost; **minor**, annoyance with no loss. Coverage is mandatory and short: criterion numbers on five lines. Without it, a short report reads like a reassuring one.

## Fix

Read `references/pitfalls.md` first.

- **Start from native HTML.** A real `button` brings the role, keyboard and focus. Bad ARIA is worse than none.
- **Compute the smallest colour fix, then check it on every background the colour meets in every theme.** `#767676` passes on white and fails on a dark theme, so a themed page needs one value per theme:

  ```bash
  python3 scripts/contrast.py '#8d5ba3' '#f6f0d4' '#fffaf0' --fix 4.5
  python3 scripts/contrast.py 'rgba(216,219,200,.62)' '#161b12' --opacity 0.6 --under '#0e120a'
  ```

- **Look at the result** in each state and during transitions. A green test says nothing about lost emphasis.
- **Leave a guard.** An axe test per state that also fails when a rule crashes (`incomplete.filter(r => r.error)`). Check that it fails on the old defect.
- **Tell the user what changes for their users**: component behaviour, bold text, a brand colour.
