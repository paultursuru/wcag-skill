# Pitfalls met on real pages

Read before fixing, or when an audit result looks odd.

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
