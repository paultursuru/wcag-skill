# wcag-skill

An agent skill that helps a coding agent audit and fix web accessibility against WCAG 2.2, without confusing a clean tool report with conformance.

It bundles:

- **The official text** of the WCAG 2.2 Recommendation: criteria, glossary and conformance rules, so the agent cites the criterion instead of its memory. `sc.py` prints one criterion or term at a time.
- **A test matrix** for the 55 A and AA criteria: what axe covers, what the script covers, what needs review, what needs a person.
- **`audit.mjs`**: axe per state and screen size, a keyboard walk with Tab at every size, reflow at 320 px, text spacing, forced-colours and greyscale screenshots.
- **`contrast.py`**: exact ratios, never rounded, opacity compositing, and the smallest colour change that passes on every background.
- **A list of pitfalls** met on real pages (`references/pitfalls.md`), and a report template with a mandatory coverage section.

## Why another one

Automated tools see a fraction of WCAG: axe has rules for 23 of the 55 A and AA criteria, often for a small part of them. Three things in this skill come from getting that wrong in practice:

- **Scores hide states.** A page with a Lighthouse score of 96 had 4 axe violations, and scored 43 in its other theme. The audit runs per state and per size.
- **Empty results lie.** An axe rule that crashes lands in `incomplete` with no violation, so a page looks clean. The script reports `AXE RULE DID NOT RUN` and fails. A page stuck at `opacity: 0` looks clean too, so it reports `PAGE HIDDEN` and fails.
- **Reports reassure.** The template makes the agent list what was tested, what was not, and what a person has to do.

## Install

For Claude Code:

```bash
git clone https://github.com/paultursuru/wcag-skill
cp -R wcag-skill/skills/wcag ~/.claude/skills/wcag
cd ~/.claude/skills/wcag/scripts && npm install && npx playwright install chromium
```

Copy it to `.claude/skills/wcag` in a repository to scope it to one project. The format is a plain `SKILL.md` folder, so other agents that read those may work too. Only Claude Code has been tried.

## Use

Ask in plain words: "audit the pricing page for accessibility", "this text looks hard to read", "add a dark theme". The scripts also run alone:

```bash
node scripts/audit.mjs http://localhost:3000/pricing --state 'dark=#theme-toggle'
python3 scripts/contrast.py '#8d5ba3' '#f6f0d4' '#fffaf0' --fix 4.5
python3 scripts/sc.py 1.4.3 "large scale"
```

## Benchmark

`benchmarks/w3c_bad.py` scores the script against the W3C's [Before and After Demonstration](https://www.w3.org/WAI/demos/bad/), a deliberately broken site whose failures the W3C lists itself. Nothing in the script was written for its pages, but two of its defects were fixed after a first run there.

| Measured with axe 4.14.0 in Chromium | Result |
|---|---|
| Criteria the W3C marks as failed, still in WCAG 2.2 | 19 |
| Flagged by the script on at least one page | 9 |
| Flagged as an axe violation | 5 |
| Flagged only as a lead to check (`to check by hand`, `suspect`) | 4 |
| Violations on the four fixed pages | 2.5.8 only, on the demo's banner links (94 × 20 px). That criterion did not exist in WCAG 2.0, the version of the W3C's reports |

So the script alone misses about half of what is known to be broken: page titles that do not describe the page, fake headings, unlabelled fields, context changes. That is the point of the test matrix, and a flagged criterion is not proof of finding the same defect as the W3C.

## Limits

- **The agent workflow is not benchmarked yet.** The numbers above measure the script, not whether an agent following `SKILL.md` finds the other half.
- **Chromium only.** No Safari, no Firefox, no real screen reader. The skill asks a person for those.
- **Pages behind a login, or states that need mocked data,** go in your own Playwright spec with `AxeBuilder`. The script handles public URLs and states reached by clicks.
- **It does not replace testing with disabled users,** and it does not produce a legal conformance statement.

## Updating

The references are regenerated from the Recommendation and the Editor's Draft, which are downloaded data. Put them in a separate folder and run with `-I`:

```bash
python3 -I skills/wcag/scripts/build_references.py recommendation.html draft.html skills/wcag/references
```

`test-matrix.md` and the number of criteria axe covers are written by hand: review them if the specification or the axe version changes.

## License

MIT for the skill and scripts. The WCAG text in `references/` stays under the W3C Document License: see [NOTICE.md](NOTICE.md). Not affiliated with or endorsed by the W3C.
