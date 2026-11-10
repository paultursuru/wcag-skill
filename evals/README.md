# Evals

Four cases that compare an agent with and without the skill. Each folder holds the prompt, the expected outcome and one grader per assertion.

| Case | What it tests |
|---|---|
| `contrast-and-conformance` | A contrast ratio, the smallest fix, and refusing a conformance claim based on a Lighthouse score |
| `w3c-bad-broken-pages` | Finding the failures the W3C lists on its broken demo, including those no tool flags |
| `w3c-bad-fixed-page` | Inventing no failure on the fixed demo, and reporting the WCAG 2.2 target-size issue |
| `hidden-traps-landing-page` | Defects a plain axe run hides: a crashed contrast rule, a failure only in the dark theme, a closed menu that takes focus off screen |

`hidden-traps-landing-page` needs its page served before the run. Copy `site/` outside the agent's working folder first, so the agent judges the page through the browser and cannot read the answers in its source:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 -d /path/to/copy/of/site
```

## Results so far

One run per configuration, so these are indications, not measurements.

| Run | With skill | Without skill |
|---|---|---|
| Iteration 1, three W3C and contrast cases | 83% of assertions | 83% |
| Iteration 2, hidden traps | 5/5, 124k tokens | 5/5, 82k tokens |
| Iteration 3, hidden traps, shorter skill | 5/5, 92k tokens | not rerun |

No case has shown the skill finding more defects than the model alone. What it changed: the report's structure and coverage section, and one real defect more in iteration 2.
