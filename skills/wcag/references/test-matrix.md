# Test matrix: the 55 A and AA criteria of WCAG 2.2

How to test, not what is required: `python3 scripts/sc.py <number>` prints the binding text.

- `axe`: axe-core 4.14.0 has a rule, usually for a small part of the criterion. `script`: `audit.mjs` checks it or prints a suspect.
- No mark, or a question after the mark: yours to review in the code, the accessibility tree (`locator.ariaSnapshot()`) and the screenshots.
- **Person**: needs a human or a real assistive technology. Ask, do not conclude for them.
- No matching content: write "not applicable", which is not "passed".

**Not applicable unless the content exists:** 1.2.1, 1.2.2 (both `axe`), 1.2.3, 1.2.5 prerecorded audio or video, then a **person** judges transcript, captions and audio description. 1.2.4 live media. 1.4.2 (`axe`) sound that starts by itself. 3.2.6 repeated help. 3.3.4 legal or financial commitment, user data change. 3.3.7 multi-step process. 3.3.8 login.

## 1. Perceivable

- **1.1.1** `axe` sees that a name exists, not that it is right. Does the alternative say what the image says? Decorative: `alt=""` or `aria-hidden`. Map or chart: is the information also in text?
- **1.3.1** `axe` Does what the styling shows exist in the tree: `h1` to `h6`, lists, tables, `label` tied to its field, groups? Compare a screenshot with `ariaSnapshot`.
- **1.3.2** Does DOM order give the same meaning as the screen? `order`, `grid` and `position` can reverse it.
- **1.3.3** Instructions such as "on the right", "the green circle", "below": is the control also named?
- **1.3.4** `axe` Works at 844x390 and 390x844? Check `orientation` in the manifest.
- **1.3.5** `axe` Fields about the user (name, email, address): `autocomplete` present and correct.
- **1.4.1** `axe` (links in text only). In `-grayscale.png`, can information, state, links and emphasis still be told apart? Two colours are distinct from 3:1. `strong` with normal weight and a colour is emphasis by colour alone.
- **1.4.3** `axe` in every state. Measure each `to check by hand` case with `contrast.py`: gradient, background image, pseudo-element, and single-character labels (`i`, `×`), which axe never judges. `opacity` on a block lowers the contrast of all its text, and axe only approximates it. Exempt: inactive components, decoration, logotypes.
- **1.4.4** `axe` `script` (half width, the layout of a 200% zoom). Horizontal scroll alone is allowed. Real zoom: **person**.
- **1.4.5** An image holding text that could be real text? Logos are exempt.
- **1.4.10** `script` at 320 px. Is anything lost? Content needing two dimensions (map, table) is exempt, its controls are not.
- **1.4.11** Field border, selected or checked state, focus indicator, standalone icon, meaningful graphic: 3:1 against adjacent colours, in every theme (`contrast.py`). The browser's default focus ring often fails on a dark surface. Two states that do not touch need not contrast with each other.
- **1.4.12** `axe` `script` injects the spacing and prints clipped text or overflow.
- **1.4.13** Content revealed on hover or focus: Escape dismisses it without moving the pointer, the pointer can move onto it, it stays until dismissed.

## 2. Operable

- **2.1.1** `axe` `script` (Tab walk, focus removed by script, `cursor: pointer` with no role). Then do the whole task with the keyboard alone in Playwright: Tab, Enter, Space, arrows, Escape.
- **2.1.2** `script` for loops. Modals, maps, iframes: can the keyboard leave?
- **2.1.4** Search `keydown`: a single-key shortcut with no modifier must be possible to turn off, remap, or act only on focus.
- **2.2.1** `axe` Any time limit: session, toast carrying an action, `setTimeout` that removes content.
- **2.2.2** `axe` Anything moving by itself for over 5 s next to other content: can it be paused, stopped or hidden?
- **2.3.1** Nothing flashes more than 3 times a second.
- **2.4.1** `axe` `main`, `nav`, headings, or a skip link if a long block repeats.
- **2.4.2** `axe` sees that a title exists. Does it describe the page, and differ across pages?
- **2.4.3** `script` prints the order: read it. Opening a drawer or modal moves focus into it, closing brings it back. A closed drawer moved off screen with `transform` keeps its controls in the order.
- **2.4.4** `axe` Is the purpose clear from the link text and its sentence, paragraph or cell? Repeated "See", "Here", "More".
- **2.4.5** Two ways to find a page, except a step in a process.
- **2.4.6** Do headings and labels describe the topic or purpose?
- **2.4.7** `script` (no style change on focus, focus removed by script). Look at focus in each theme.
- **2.4.11** `script` (`elementFromPoint`). Sticky header, bottom panel, banner, open drawer. Only full obscuring fails, and read Note 2 for content the user opened.
- **2.5.1** Pinch, swipe, path: is there a single-pointer alternative with no path (+ and - buttons)?
- **2.5.2** Search `mousedown`, `pointerdown`, `touchstart`: the action fires on release, or can be cancelled.
- **2.5.3** `axe` Each `aria-label` and `aria-labelledby`: is the visible text in the name, preferably at the start? A toggle with two visible labels cannot hold both in one name. Voice control: **person**.
- **2.5.4** Search `devicemotion`, `deviceorientation`: on-screen alternative and a way to turn it off.
- **2.5.7** Each drag (slider, map, sorting) has a single-pointer alternative, such as a click on the track.
- **2.5.8** `axe` Read the criterion for the exceptions (spacing, inline, equivalent).

## 3. Understandable

- **3.1.1** `axe` Does `lang` match the real language, on each translated route?
- **3.1.2** `axe` A passage in another language carries `lang`. Proper names and technical terms are exempt.
- **3.2.1** `script` (URL change, focus removed by script). Taking focus opens, submits and moves nothing.
- **3.2.2** Changing a `select`, checkbox or text does not navigate or submit without warning.
- **3.2.3** Repeated navigation keeps the same order from page to page.
- **3.2.4** The same function has the same name everywhere. Compare the labels of links to the same target.
- **3.3.1** Trigger each error through each input path: is it described in text and the field identified?
- **3.3.2** `axe` Each field has a visible label or instruction.
- **3.3.3** Is a known correction offered?

## 4. Robust

- **4.1.2** `axe` Compare `ariaSnapshot` before and after each action: do name, role and state (`aria-expanded`, `aria-pressed`, `aria-selected`) follow? A link inside a link is split by the parser into an empty link. Real output: **person**.
- **4.1.3** Result, error, loading, toast: `role="status"`, `role="alert"` or `aria-live`, in the DOM before the message. Real announcement: **person**.
