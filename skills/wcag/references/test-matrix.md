# Test matrix: the 55 A and AA criteria of WCAG 2.2

The binding text is in `success-criteria.md`. Read the criterion before concluding: this matrix says how to test, not what is required. The `axe` columns come from axe-core 4.14.0 (`axe.getRules`, `wcag*` tags).

- **axe**: a rule exists. It often covers a small part of the criterion. `off`: disabled by default, but run when filtering by tags, as `audit.mjs` does.
- **script**: `audit.mjs` checks it or reports it as a suspect, to confirm.
- **review**: done by reading the code, the accessibility tree (`locator.ariaSnapshot()`) and the screenshots. An agent can do this.
- **person**: needs a human or a real assistive technology. Ask for it, do not conclude in their place.

A criterion with no matching content is "not applicable", and must be written as such. That does not mean "passed without testing".

## 1. Perceivable

| Criterion | Level | axe | How to check |
|---|---|---|---|
| 1.1.1 Non-text Content | A | `image-alt`, `svg-img-alt`, `role-img-alt`, `input-image-alt`, `object-alt`, `aria-meter-name`, `aria-progressbar-name` | **Review.** Axe sees that a name exists, not that it is right. Does the alternative say what the image says? Decorative: `alt=""` or `aria-hidden`. Map or chart: does the information also exist as text? |
| 1.2.1 Audio-only and Video-only | A | `audio-caption` (off) | Not applicable without media. Otherwise **person**: is the transcript complete? |
| 1.2.2 Captions (Prerecorded) | A | `video-caption` | Not applicable without video. Otherwise **person**: are the captions accurate? |
| 1.2.3 Audio Description or Media Alternative | A | none | Not applicable without video. Otherwise **person**. |
| 1.2.4 Captions (Live) | AA | none | Not applicable without live media. |
| 1.2.5 Audio Description (Prerecorded) | AA | none | Not applicable without video. Otherwise **person**. |
| 1.3.1 Info and Relationships | A | `list`, `listitem`, `definition-list`, `dlitem`, `p-as-heading`, `td-has-header`, `td-headers-attr`, `th-has-data-cells`, `table-fake-caption`, `aria-required-children`, `aria-required-parent`, `aria-hidden-body` | **Review.** Does what the styling shows exist in the tree: `h1` to `h6` headings, lists, tables, linked `label`s, groups? Compare the screenshot with `ariaSnapshot`. |
| 1.3.2 Meaningful Sequence | A | none | **Review.** Does the DOM order give the same meaning as the screen? `order`, `grid` and `position` can reverse it. |
| 1.3.3 Sensory Characteristics | A | none | **Review.** Look for instructions such as "on the right", "the green circle", "below": is the control also named? |
| 1.3.4 Orientation | AA | `css-orientation-lock` | **Review.** Test at 844x390 and 390x844. Also check `orientation` in the manifest. |
| 1.3.5 Identify Input Purpose | AA | `autocomplete-valid` | **Review.** Only fields about the user (name, email, address): `autocomplete` present and correct. |
| 1.4.1 Use of Color | A | `link-in-text-block` | **Review** of the `-grayscale.png` screenshot: can information, state, links and emphasis still be told apart? Two colours count as distinct if their contrast reaches 3:1 (Understanding 1.4.1). |
| 1.4.2 Audio Control | A | `no-autoplay-audio` | Not applicable without automatic sound. |
| 1.4.3 Contrast (Minimum) | AA | `color-contrast` | **Axe in every state.** `to check by hand` cases (gradient, background image, pseudo-element, SVG text): measure with `contrast.py`. Exempt: inactive components, decoration, logotypes. |
| 1.4.4 Resize Text | AA | `meta-viewport` | **Script** (width halved, same layout as a 200% zoom). Horizontal scroll alone is allowed and only prints a `note`. Real zoom in Safari and Chrome: **person**. |
| 1.4.5 Images of Text | AA | none | **Review.** Does an image hold text that could be real text? Logos are exempt. |
| 1.4.10 Reflow | AA | none | **Script** at 320 px, then **review** of the screenshot: is anything lost? Content that requires two dimensions (map, table) is exempt, its controls are not. |
| 1.4.11 Non-text Contrast | AA | none | **Review + `contrast.py`.** Field border, selected or checked state, focus, standalone icon, meaningful graphic: 3:1 against adjacent colours. Two states that do not touch need not contrast with each other (Understanding 1.4.11). |
| 1.4.12 Text Spacing | AA | `avoid-inline-spacing` | **Script**: the criterion's spacing is injected, then clipped text or overflow is reported. Look at `-320-text-spacing.png`. |
| 1.4.13 Content on Hover or Focus | AA | none | **Review.** For each content revealed on hover or focus: Escape dismisses it without moving the pointer, the pointer can move onto it, it stays until dismissed. |

## 2. Operable

| Criterion | Level | axe | How to check |
|---|---|---|---|
| 2.1.1 Keyboard | A | `scrollable-region-focusable`, `frame-focusable-content`, `server-side-image-map` | **Script** (Tab, focus removed by script, `cursor: pointer` with no role). Then **review**: do the whole task with the keyboard alone in Playwright (Tab, Enter, Space, arrows, Escape). |
| 2.1.2 No Keyboard Trap | A | none | **Script** for loops. **Review** for modals, maps and iframes: can you leave with the keyboard? Applies to all content, even non-essential. |
| 2.1.4 Character Key Shortcuts | A | none | **Review.** Search for `keydown`: a single-key shortcut with no modifier must be possible to turn off, remap, or act only on focus. |
| 2.2.1 Timing Adjustable | A | `meta-refresh` | **Review.** Any time limit: session, toast that carries an action, `setTimeout` that removes content. |
| 2.2.2 Pause, Stop, Hide | A | `blink`, `marquee` | **Review.** Anything moving by itself for over 5 s next to other content: can it be paused, stopped or hidden? Applies to all content. |
| 2.3.1 Three Flashes or Below Threshold | A | none | **Review.** Nothing flashes more than 3 times a second? Applies to all content. |
| 2.4.1 Bypass Blocks | A | `bypass` | **Review.** `main`, `nav`, headings, or a skip link if a long block repeats. |
| 2.4.2 Page Titled | A | `document-title` | **Review.** Does the title describe the page? Axe only sees that it exists. Compare titles across pages. |
| 2.4.3 Focus Order | A | none | **Script** prints the order: read it. **Review**: opening a drawer or modal moves focus into it, closing brings it back. |
| 2.4.4 Link Purpose (In Context) | A | `link-name`, `area-alt` | **Review.** Is the purpose clear from the link text and its sentence, paragraph or cell? Look for repeated "See", "Here", "More". |
| 2.4.5 Multiple Ways | AA | none | **Review.** Two ways to find a page, except a step in a process. |
| 2.4.6 Headings and Labels | AA | none | **Review.** Do headings and labels describe the topic or purpose? |
| 2.4.7 Focus Visible | AA | none | **Script** (no style change on focus, focus removed by script). **Review**: screenshot of focus in each theme. The indicator's contrast belongs to 1.4.11. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | none | **Script** (`elementFromPoint`). **Review**: sticky header, bottom panel, banner. Only full obscuring fails. |
| 2.5.1 Pointer Gestures | A | none | **Review.** Pinch, swipe, path: is there a single-pointer alternative without a path (+ and - buttons)? |
| 2.5.2 Pointer Cancellation | A | none | **Review.** Search for `mousedown`, `pointerdown`, `touchstart`: the action must fire on release, or be possible to cancel. |
| 2.5.3 Label in Name | A | `label-content-name-mismatch` | **Review** of each `aria-label` and `aria-labelledby`: is the visible text in the name, preferably at the start? Voice control: **person**. |
| 2.5.4 Motion Actuation | A | none | **Review.** Search for `devicemotion`, `deviceorientation`: on-screen alternative and a way to turn it off. |
| 2.5.7 Dragging Movements | AA | none | **Review.** Does each drag (slider, map, sorting) have a single-pointer alternative without dragging, such as a click on the track? |
| 2.5.8 Target Size (Minimum) | AA | `target-size` (off) | **Axe.** Read the criterion for the exceptions (spacing, inline, equivalent). |

## 3. Understandable

| Criterion | Level | axe | How to check |
|---|---|---|---|
| 3.1.1 Language of Page | A | `html-has-lang`, `html-lang-valid`, `html-xml-lang-mismatch` | **Review.** Does `lang` match the real language, on each translated route? |
| 3.1.2 Language of Parts | AA | `valid-lang` | **Review.** Does a passage in another language carry `lang`? Proper names and technical terms are exempt. |
| 3.2.1 On Focus | A | none | **Script** (URL change, focus removed by script). **Review**: taking focus opens, submits and moves nothing. |
| 3.2.2 On Input | A | none | **Review.** Changing a `select`, checkbox or text does not navigate or submit without warning. |
| 3.2.3 Consistent Navigation | AA | none | **Review.** Repeated navigation keeps the same order from page to page. |
| 3.2.4 Consistent Identification | AA | none | **Review.** Does the same function have the same name everywhere? Compare the labels of links to the same target. |
| 3.2.6 Consistent Help | A | none | **Review.** Repeated help stays in the same relative place. Not applicable without help. |
| 3.3.1 Error Identification | A | none | **Review.** Trigger each error through each input path: is the error described in text and the field identified? |
| 3.3.2 Labels or Instructions | A | `form-field-multiple-labels` | **Review.** Does each field have a visible label or instruction? |
| 3.3.3 Error Suggestion | AA | none | **Review.** Is a known correction offered? |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | none | Not applicable without a legal or financial commitment or data change. |
| 3.3.7 Redundant Entry | A | none | **Review.** Is information already entered in the same process reused or offered? |
| 3.3.8 Accessible Authentication (Minimum) | AA | none | Not applicable without a login. |

## 4. Robust

| Criterion | Level | axe | How to check |
|---|---|---|---|
| 4.1.2 Name, Role, Value | A | 29 rules, including `button-name`, `link-name`, `label`, `select-name`, `input-button-name`, `aria-valid-attr`, `aria-required-attr`, `aria-hidden-focus`, `nested-interactive` | **Review.** Compare `ariaSnapshot` before and after each action: do the name, role and state (`aria-expanded`, `aria-pressed`, `aria-selected`) follow? Real output: **person**. |
| 4.1.3 Status Messages | AA | none | **Review.** Result, error, loading, toast: `role="status"`, `role="alert"` or `aria-live`, present in the DOM before the message. Real announcement: **person**, with VoiceOver or TalkBack. |
