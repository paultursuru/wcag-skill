# WCAG 2.2: glossary

Text taken verbatim from the WCAG 2.2 W3C Recommendation 12 December 2024: https://www.w3.org/TR/WCAG22/
Only formatting was changed. The later W3C Editor's Draft 02 November 2026 is at https://w3c.github.io/wcag/guidelines/22/ and is not normative.
Extracted on 2026-11-09 by scripts/build_references.py. Copyright © 2020-2024 World Wide Web Consortium. W3C® liability, trademark and document use rules apply.
Copyright © 2023 W3C®. This software or document includes material copied from or derived from Web Content Accessibility Guidelines (WCAG) 2.2, https://www.w3.org/TR/WCAG22/.
Terms in *italics* are defined in glossary.md.

Print one with: `python3 scripts/sc.py "contrast ratio"`.

### abbreviation

shortened form of a word, phrase, or name where the abbreviation has not become part of the language
> **Note 1:** This includes initialisms and acronyms where:
1. **initialisms** are shortened forms of a name or phrase made from the initial letters of words or syllables contained in that name or phrase
  > **Note 2:** Not defined in all languages.
2. **acronyms** are abbreviated forms made from the initial letters or parts of other words (in a name or phrase) which may be pronounced as a word
> **Note 3:** Some companies have adopted what used to be an initialism as their company name. In these cases, the new name of the company is the letters (for example, Ecma) and the word is no longer considered an abbreviation.

### accessibility supported

supported by users' *assistive technologies* as well as the accessibility features in browsers and other *user agents*
To qualify as an accessibility-supported use of a web content technology (or feature of a technology), both 1 and 2 must be satisfied for a web content technology (or feature):
1. **The way that the *web content technology* is used must be supported by users' assistive technology (AT).** This means that the way that the technology is used has been tested for interoperability with users' assistive technology in the *human language(s)* of the content,
  **AND**
2. **The web content technology must have accessibility-supported user agents that are available to users.** This means that at least one of the following four statements is true:
  1. The technology is supported natively in widely-distributed user agents that are also accessibility supported (such as HTML and CSS);
    **OR**
  2. The technology is supported in a widely-distributed plug-in that is also accessibility supported;
    **OR**
  3. The content is available in a closed environment, such as a university or corporate network, where the user agent required by the technology and used by the organization is also accessibility supported;
    **OR**
  4. The user agent(s) that support the technology are accessibility supported and are available for download or purchase in a way that:
    - does not cost a person with a disability any more than a person without a disability **and**
    - is as easy to find and obtain for a person with a disability as it is for a person without disabilities.
> **Note 1:** The Accessibility Guidelines Working Group and the W3C do not specify which or how much support by assistive technologies there must be for a particular use of a web technology in order for it to be classified as accessibility supported. (See Level of Assistive Technology Support Needed for "Accessibility Support".)
> **Note 2:** Web technologies can be used in ways that are not accessibility supported as long as they are not *relied upon* and the page as a whole meets the conformance requirements, including Conformance Requirement 4 and Conformance Requirement 5.
> **Note 3:** When a *web technology* is used in a way that is "accessibility supported," it does not imply that the entire technology or all uses of the technology are supported. Most technologies, including HTML, lack support for at least one feature or use. Pages conform to WCAG only if the uses of the technology that are accessibility supported can be relied upon to meet WCAG requirements.
> **Note 4:** When citing web content technologies that have multiple versions, the version(s) supported should be specified.
> **Note 5:** One way for authors to locate uses of a technology that are accessibility supported would be to consult compilations of uses that are documented to be accessibility supported. (See Understanding Accessibility-Supported Web Technology Uses.) Authors, companies, technology vendors, or others may document accessibility-supported ways of using web content technologies. However, all ways of using technologies in the documentation would need to meet the definition of accessibility-supported Web content technologies above.

### alternative for time-based media

document including correctly sequenced text descriptions of time-based visual and auditory information and providing a means for achieving the outcomes of any time-based interaction
> **Note:** A screenplay used to create the synchronized media content would meet this definition only if it was corrected to accurately represent the final synchronized media after editing.

### ambiguous to users in general

the purpose cannot be determined from the link and all information of the web page presented to the user simultaneously with the link (i.e., readers without disabilities would not know what a link would do until they activated it)

### ASCII art

picture created by a spatial arrangement of characters or glyphs (typically from the 95 printable characters defined by ASCII)

### assistive technology (as used in this document)

hardware and/or software that acts as a *user agent*, or along with a mainstream user agent, to provide functionality to meet the requirements of users with disabilities that go beyond those offered by mainstream user agents
> **Note 1:** Functionality provided by assistive technology includes alternative presentations (e.g., as synthesized speech or magnified content), alternative input methods (e.g., voice), additional navigation or orientation mechanisms, and content transformations (e.g., to make tables more accessible).
> **Note 2:** Assistive technologies often communicate data and messages with mainstream user agents by using and monitoring APIs.
> **Note 3:** The distinction between mainstream user agents and assistive technologies is not absolute. Many mainstream user agents provide some features to assist individuals with disabilities. The basic difference is that mainstream user agents target broad and diverse audiences that usually include people with and without disabilities. Assistive technologies target narrowly defined populations of users with specific disabilities. The assistance provided by an assistive technology is more specific and appropriate to the needs of its target users. The mainstream user agent may provide important functionality to assistive technologies like retrieving web content from program objects or parsing markup into identifiable bundles.

### audio

the technology of sound reproduction
> **Note:** Audio can be created synthetically (including speech synthesis), recorded from real world sounds, or both.

### audio description

narration added to the soundtrack to describe important visual details that cannot be understood from the main soundtrack alone
> **Note 1:** Audio description of *video* provides information about actions, characters, scene changes, on-screen text, and other visual content.
> **Note 2:** In standard audio description, narration is added during existing pauses in dialogue. (See also *extended audio description*.)
> **Note 3:** Where all of the *video* information is already provided in existing *audio*, no additional audio description is necessary.
> **Note 4:** Also called "video description" and "descriptive narration."

### audio-only

a time-based presentation that contains only *audio* (no *video* and no interaction)

### blinking

switch back and forth between two visual states in a way that is meant to draw attention
> **Note:** See also *flash*. It is possible for something to be large enough and blink brightly enough at the right frequency to be also classified as a flash.

### blocks of text

more than one sentence of text

### CAPTCHA

initialism for "Completely Automated Public Turing test to tell Computers and Humans Apart"
> **Note 1:** CAPTCHA tests often involve asking the user to type in text that is displayed in an obscured image or audio file.
> **Note 2:** A Turing test is any system of tests designed to differentiate a human from a computer. It is named after famed computer scientist Alan Turing. The term was coined by researchers at Carnegie Mellon University.

### captions

synchronized visual and/or *text alternative* for both speech and non-speech audio information needed to understand the media content
> **Note 1:** Captions are similar to dialogue-only subtitles except captions convey not only the content of spoken dialogue, but also equivalents for non-dialogue audio information needed to understand the program content, including sound effects, music, laughter, speaker identification and location.
> **Note 2:** Closed Captions are equivalents that can be turned on and off with some players.
> **Note 3:** Open Captions are any captions that cannot be turned off. For example, if the captions are visual equivalent *images of text* embedded in *video*.
> **Note 4:** Captions should not obscure or obstruct relevant information in the video.
> **Note 5:** In some countries, captions are called subtitles.
> **Note 6:** *Audio descriptions* can be, but do not need to be, captioned since they are descriptions of information that is already presented visually.

### changes of context

major changes that, if made without user awareness, can disorient users who are not able to view the entire page simultaneously
Changes in context include changes of:
- *user agent*;
- *viewport*;
- focus;
- *content* that changes the meaning of the *web page*
> **Note:** A change of content is not always a change of context. Changes in content, such as an expanding outline, dynamic menu, or a tab control do not necessarily change the context, unless they also change one of the above (e.g., focus).

### cognitive function test

New
A task that requires the user to remember, manipulate, or transcribe information. Examples include, but are not limited to:
- memorization, such as remembering a username, password, set of characters, images, or patterns. The common identifiers name, e-mail, and phone number are not considered cognitive function tests as they are personal to the user and consistent across websites;
- transcription, such as typing in characters;
- use of correct spelling;
- performance of calculations;
- solving of puzzles.

### conformance

satisfying all the requirements of a given standard, guideline or specification

### conforming alternate version

version that
1. conforms at the designated level, and
2. provides all of the same information and *functionality* in the same *human language*, and
3. is as up to date as the non-conforming content, and
4. for which at least one of the following is true:
  1. the conforming version can be reached from the non-conforming page via an *accessibility-supported* *mechanism*, or
  2. the non-conforming version can only be reached from the conforming version, or
  3. the non-conforming version can only be reached from a conforming page that also provides a mechanism to reach the conforming version
> **Note 1:** In this definition, "can only be reached" means that there is some mechanism, such as a conditional redirect, that prevents a user from "reaching" (loading) the non-conforming page unless the user had just come from the conforming version.
> **Note 2:** The alternate version does not need to be matched page for page with the original (e.g., the conforming alternate version may consist of multiple pages).
> **Note 3:** If multiple language versions are available, then conforming alternate versions are required for each language offered.
> **Note 4:** Alternate versions may be provided to accommodate different technology environments or user groups. Each version should be as conformant as possible. One version would need to be fully conformant in order to meet conformance requirement 1.
> **Note 5:** The conforming alternative version does not need to reside within the scope of conformance, or even on the same website, as long as it is as freely available as the non-conforming version.
> **Note 6:** Alternate versions should not be confused with *supplementary content*, which support the original page and enhance comprehension.
> **Note 7:** Setting user preferences within the content to produce a conforming version is an acceptable mechanism for reaching another version as long as the method used to set the preferences is accessibility supported.
See Understanding Conforming Alternate Versions

### content (web content)

information and sensory experience to be communicated to the user by means of a *user agent*, including code or markup that defines the content's *structure*, *presentation*, and interactions

### context-sensitive help

help text that provides information related to the function currently being performed
> **Note:** Clear labels can act as context-sensitive help.

### contrast ratio

(L1 + 0.05) / (L2 + 0.05), where
- L1 is the *relative luminance* of the lighter of the colors, and
- L2 is the *relative luminance* of the darker of the colors.
> **Note 1:** Contrast ratios can range from 1 to 21 (commonly written 1:1 to 21:1).
> **Note 2:** Because authors do not have control over user settings as to how text is rendered (for example font smoothing or anti-aliasing), the contrast ratio for text can be evaluated with anti-aliasing turned off.
> **Note 3:** For the purpose of Success Criteria 1.4.3 and 1.4.6, contrast is measured with respect to the specified background over which the text is rendered in normal usage. If no background color is specified, then white is assumed.
> **Note 4:** Background color is the specified color of content over which the text is to be rendered in normal usage. It is a failure if no background color is specified when the text color is specified, because the user's default background color is unknown and cannot be evaluated for sufficient contrast. For the same reason, it is a failure if no text color is specified when a background color is specified.
> **Note 5:** When there is a border around the letter, the border can add contrast and would be used in calculating the contrast between the letter and its background. A narrow border around the letter would be used as the letter. A wide border around the letter that fills in the inner details of the letters acts as a halo and would be considered background.
> **Note 6:** WCAG conformance should be evaluated for color pairs specified in the content that an author would expect to appear adjacent in typical presentation. Authors need not consider unusual presentations, such as color changes made by the user agent, except where caused by authors' code.

### correct reading sequence

any sequence where words and paragraphs are presented in an order that does not change the meaning of the content

### CSS pixel

visual angle of about 0.0213 degrees
A CSS pixel is the canonical unit of measure for all lengths and measurements in CSS. This unit is density-independent, and distinct from actual hardware pixels present in a display. User agents and operating systems should ensure that a CSS pixel is set as closely as possible to the CSS Values and Units Module Level 3 reference pixel [css3-values], which takes into account the physical dimensions of the display and the assumed viewing distance (factors that cannot be determined by content authors).

### down-event

platform event that occurs when the trigger stimulus of a pointer is depressed
The down-event may have different names on different platforms, such as "touchstart" or "mousedown".

### dragging movement

New
an operation where the pointer engages with an element on the *down-event* and the element (or a representation of its position) follows the pointer until an *up-event*
> **Note:** Examples of draggable elements include list items, text elements, and images.

### emergency

a sudden, unexpected situation or occurrence that requires immediate action to preserve health, safety, or property

### essential

if removed, would fundamentally change the information or functionality of the content, **and** information and functionality cannot be achieved in another way that would conform

### extended audio description

audio description that is added to an audiovisual presentation by pausing the *video* so that there is time to add additional description
> **Note:** This technique is only used when the sense of the *video* would be lost without the additional *audio description* and the pauses between dialogue/narration are too short.

### flash

a pair of opposing changes in *relative luminance* that can cause seizures in some people if it is large enough and in the right frequency range
> **Note 1:** See *general flash and red flash thresholds* for information about types of flash that are not allowed.
> **Note 2:** See also *blinking*.

### focus indicator

New
pixels that are changed to visually indicate when a *user interface component* is in a focused *state*

### functionality

*processes* and outcomes achievable through user action

### general flash and red flash thresholds

a *flash* or rapidly changing image sequence is below the threshold (i.e., content **passes**) if any of the following are true:
- there are no more than three **general flashes** and / or no more than three **red flashes** within any one-second period; or
- the combined area of flashes occurring concurrently occupies no more than a total of .006 steradians within any 10 degree visual field on the screen (25% of any 10 degree visual field on the screen) at typical viewing distance
where:
- A **general flash** is defined as a pair of opposing changes in *relative luminance* of 10% or more of the maximum relative luminance (1.0) where the relative luminance of the darker image is below 0.80; and where "a pair of opposing changes" is an increase followed by a decrease, or a decrease followed by an increase, and
- A **red flash** is defined as any pair of opposing transitions involving a saturated red
Exception: Flashing that is a fine, balanced, pattern such as white noise or an alternating checkerboard pattern with "squares" smaller than 0.1 degree (of visual field at typical viewing distance) on a side does not violate the thresholds.
> **Note 1:** For general software or web content, using a 341 x 256 pixel rectangle anywhere on the displayed screen area when the content is viewed at 1024 x 768 pixels will provide a good estimate of a 10 degree visual field for standard screen sizes and viewing distances (e.g., 15-17 inch screen at 22-26 inches). This resolution of 75 - 85 ppi is known to be lower, and thus more conservative than the nominal CSS pixel resolution of 96 ppi in CSS specifications. Higher resolutions displays showing the same rendering of the content yield smaller and safer images so it is lower resolutions that are used to define the thresholds.
> **Note 2:** A transition is the change in relative luminance (or relative luminance/color for red flashing) between adjacent peaks and valleys in a plot of relative luminance (or relative luminance/color for red flashing) measurement against time. A flash consists of two opposing transitions.
> **Note 3:** The new working definition in the field for **"pair of opposing transitions involving a saturated red"** (from WCAG 2.2) is a pair of opposing transitions where, one transition is either to or from a state with a value R/(R + G + B) that is greater than or equal to 0.8, and the difference between states is more than 0.2 (unitless) in the CIE 1976 UCS chromaticity diagram. [ISO_9241-391]
> **Note 4:** Tools are available that will carry out analysis from video screen capture. However, no tool is necessary to evaluate for this condition if flashing is less than or equal to 3 flashes in any one second. Content automatically passes (see #1 and #2 above).

### human language

language that is spoken, written or signed (through visual or tactile means) to communicate with humans
> **Note:** See also *sign language*.

### idiom

phrase whose meaning cannot be deduced from the meaning of the individual words and the specific words cannot be changed without losing the meaning
> **Note:** Idioms cannot be translated directly, word for word, without losing their (cultural or language-dependent) meaning.

### image of text

text that has been rendered in a non-text form (e.g., an image) in order to achieve a particular visual effect
> **Note:** This does not include text that is part of a picture that contains significant other visual content.

### informative

for information purposes and not required for conformance
> **Note:** Content required for *conformance* is referred to as "*normative*."

### input error

information provided by the user that is not accepted
> **Note:** This includes:
> 1. Information that is required by the *web page* but omitted by the user
> 2. Information that is provided by the user but that falls outside the required data format or values

### jargon

words used in a particular way by people in a particular field

### keyboard interface

interface used by software to obtain keystroke input
> **Note 1:** A keyboard interface allows users to provide keystroke input to programs even if the native technology does not contain a keyboard.
> **Note 2:** Operation of the application (or parts of the application) through a keyboard-operated mouse emulator, such as MouseKeys, does not qualify as operation through a keyboard interface because operation of the program is through its pointing device interface, not through its keyboard interface.

### keyboard shortcut

alternative means of triggering an action by the pressing of one or more keys

### label

*text* or other component with a *text alternative* that is presented to a user to identify a component within web *content*
> **Note 1:** A label is presented to all users whereas the *name* may be hidden and only exposed by assistive technology. In many (but not all) cases the name and the label are the same.
> **Note 2:** The term label is not limited to the label element in HTML.

### large scale (text)

with at least 18 point or 14 point bold or font size that would yield equivalent size for Chinese, Japanese and Korean (CJK) fonts
> **Note 1:** Fonts with extraordinarily thin strokes or unusual features and characteristics that reduce the familiarity of their letter forms are harder to read, especially at lower contrast levels.
> **Note 2:** Font size is the size when the content is delivered. It does not include resizing that may be done by a user.
> **Note 3:** The actual size of the character that a user sees is dependent both on the author-defined size and the user's display or user agent settings. For many mainstream body text fonts, 14 and 18 point is roughly equivalent to 1.2 and 1.5 em or to 120% or 150% of the default size for body text (assuming that the body font is 100%), but authors would need to check this for the particular fonts in use. When fonts are defined in relative units, the actual point size is calculated by the user agent for display. The point size should be obtained from the user agent, or calculated based on font metrics as the user agent does, when evaluating this success criterion. Users who have low vision would be responsible for choosing appropriate settings.
> **Note 4:** When using text without specifying the font size, the smallest font size used on major browsers for unspecified text would be a reasonable size to assume for the font. If a level 1 heading is rendered in 14pt bold or higher on major browsers, then it would be reasonable to assume it is large text. Relative scaling can be calculated from the default sizes in a similar fashion.
> **Note 5:** The 18 and 14 point sizes for roman texts are taken from the minimum size for large print (14pt) and the larger standard font size (18pt). For other fonts such as CJK languages, the "equivalent" sizes would be the minimum large print size used for those languages and the next larger standard large print size.

### legal commitments

transactions where the person incurs a legally binding obligation or benefit

### link purpose

nature of the result obtained by activating a hyperlink

### live

information captured from a real-world event and transmitted to the receiver with no more than a broadcast delay
> **Note 1:** A broadcast delay is a short (usually automated) delay, for example used in order to give the broadcaster time to cue or censor the audio (or video) feed, but not sufficient to allow significant editing.
> **Note 2:** If information is completely computer generated, it is not live.

### lower secondary education level

the two or three year period of education that begins after completion of six years of school and ends nine years after the beginning of *primary education*
> **Note:** This definition is based on the International Standard Classification of Education [UNESCO].

### mechanism

*process* or technique for achieving a result
> **Note 1:** The mechanism may be explicitly provided in the content, or may be *relied upon* to be provided by either the platform or by *user agents*, including *assistive technologies*.
> **Note 2:** The mechanism needs to meet all success criteria for the conformance level claimed.

### media alternative for text

media that presents no more information than is already presented in text (directly or via text alternatives)
> **Note:** A media alternative for text is provided for those who benefit from alternate representations of text. Media alternatives for text may be audio-only, video-only (including sign-language video), or audio-video.

### minimum bounding box

New
the smallest enclosing rectangle aligned to the horizontal axis within which all the points of a shape lie. For components which wrap onto multiple lines as part of a sentence or *block of text* (such as hypertext links), the bounding box is based on how the component would appear on a single line.

### motion animation

addition of steps between conditions to create the illusion of movement or to give a sense of a smooth transition

### name

text by which software can identify a component within web content to the user
> **Note 1:** The name may be hidden and only exposed by assistive technology, whereas a *label* is presented to all users. In many (but not all) cases, the label and the name are the same.
> **Note 2:** This is unrelated to the name attribute in HTML.

### navigated sequentially

navigated in the order defined for advancing focus (from one element to the next) using a *keyboard interface*

### non-text content

any content that is not a sequence of characters that can be *programmatically determined* or where the sequence is not expressing something in *human language*
> **Note:** This includes *ASCII art* (which is a pattern of characters), emoticons, leetspeak (which uses character substitution), and images representing text

### normative

required for conformance
> **Note 1:** One may conform in a variety of well-defined ways to this document.
> **Note 2:** Content identified as "*informative*" or "non-normative" is never required for *conformance*.

### on a full-screen window

on the most common sized desktop/laptop display with the *viewport* maximized
> **Note:** Since people generally keep their computers for several years, it is best not to rely on the latest desktop/laptop display resolutions but to consider the common desktop/laptop display resolutions over the course of several years when making this evaluation.

### paused

stopped by user request and not resumed until requested by user

### perimeter

New
continuous line forming the boundary of a shape not including shared pixels, or the *minimum bounding box*, whichever is shortest.

### pointer input

input from a device that can target a specific coordinate (or set of coordinates) on a screen, such as a mouse, pen, or touch contact
> **Note:** See the Pointer Events definition for "pointer" [pointerevents].

### prerecorded

information that is not *live*

### presentation

rendering of the *content* in a form to be perceived by users

### primary education level

six year time period that begins between the ages of five and seven, possibly without any previous education
> **Note:** This definition is based on the International Standard Classification of Education [UNESCO].

### process

series of user actions where each action is required in order to complete an activity

### programmatically determined (programmatically determinable)

determined by software from author-supplied data provided in a way that different *user agents*, including *assistive technologies*, can extract and present this information to users in different modalities

### programmatically determined link context

additional information that can be *programmatically determined* from *relationships* with a link, combined with the link text, and presented to users in different modalities
> **Note:** Since screen readers interpret punctuation, they can also provide the context from the current sentence, when the focus is on a link in that sentence.

### programmatically set

set by software using methods that are supported by *user agents*, including *assistive technologies*

### pure decoration

serving only an aesthetic purpose, providing no information, and having no functionality
> **Note:** Text is only purely decorative if the words can be rearranged or substituted without changing their purpose.

### real-time event

event that a) occurs at the same time as the viewing and b) is not completely generated by the content

### region

perceivable, *programmatically determined* *section* of content
> **Note:** In HTML, any area designated with a landmark role would be a region.

### relationships

meaningful associations between distinct pieces of content

### relative luminance

the relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white
> **Note 1:** For the sRGB colorspace, the relative luminance of a color is defined as L = 0.2126 * **R** + 0.7152 * **G** + 0.0722 * **B** where **R**, **G** and **B** are defined as:
> - if RsRGB <= 0.04045 then **R** = RsRGB/12.92 else **R** = ((RsRGB+0.055)/1.055) ^ 2.4
> - if GsRGB <= 0.04045 then **G** = GsRGB/12.92 else **G** = ((GsRGB+0.055)/1.055) ^ 2.4
> - if BsRGB <= 0.04045 then **B** = BsRGB/12.92 else **B** = ((BsRGB+0.055)/1.055) ^ 2.4
> and RsRGB, GsRGB, and BsRGB are defined as:
> - RsRGB = R8bit/255
> - GsRGB = G8bit/255
> - BsRGB = B8bit/255
> The "^" character is the exponentiation operator. (Formula taken from [SRGB].)
> **Note 2:** Before May 2021 the value of 0.04045 in the definition was different (0.03928). It was taken from an older version of the specification and has been updated. It has no practical effect on the calculations in the context of these guidelines.
> **Note 3:** Almost all systems used today to view web content assume sRGB encoding. Unless it is known that another color space will be used to process and display the content, authors should evaluate using sRGB colorspace. If using other color spaces, see Understanding Success Criterion 1.4.3.
> **Note 4:** If dithering occurs after delivery, then the source color value is used. For colors that are dithered at the source, the average values of the colors that are dithered should be used (average R, average G, and average B).
> **Note 5:** Tools are available that automatically do the calculations when testing contrast and flash.
> **Note 6:** A separate page giving the relative luminance definition using MathML to display the formulas is available.

### relied upon (technologies that are)

the content would not *conform* if that *technology* is turned off or is not supported

### role

text or number by which software can identify the function of a component within Web content

### same functionality

same result when used

### same relative order

same position relative to other items
> **Note:** Items are considered to be in the same relative order even if other items are inserted or removed from the original order. For example, expanding navigation menus may insert an additional level of detail or a secondary navigation section may be inserted into the reading order.

### satisfies a success criterion

the success criterion does not evaluate to 'false' when applied to the page

### section

a self-contained portion of written content that deals with one or more related topics or thoughts
> **Note:** A section may consist of one or more paragraphs and include graphics, tables, lists and sub-sections.

### set of web pages

collection of *web pages* that share a common purpose and that are created by the same author, group or organization
> **Note:** Different language versions would be considered different sets of web pages.

### sign language

a language using combinations of movements of the hands and arms, facial expressions, or body positions to convey meaning

### sign language interpretation

translation of one language, generally a spoken language, into a *sign language*
> **Note:** True sign languages are independent languages that are unrelated to the spoken language(s) of the same country or region.

### single pointer

an input modality that only targets a single point on the page/screen at a time – such as a mouse, single finger on a touch screen, or stylus.
> **Note:** Single pointer interactions include clicks, double clicks, taps, dragging motions, and single-finger swipe gestures. In contrast, multipoint interactions involve the use of two or more pointers at the same time, such as two-finger interactions on a touchscreen, or the simultaneous use of a mouse and stylus.

### specific sensory experience

a sensory experience that is not purely decorative and does not primarily convey important information or perform a function

### state

dynamic property expressing characteristics of a *user interface component* that may change in response to user action or automated processes
States do not affect the nature of the component, but represent data associated with the component or user interaction possibilities. Examples include focus, hover, select, press, check, visited/unvisited, and expand/collapse.

### status message

change in content that is not a *change of context*, and that provides information to the user on the success or results of an action, on the waiting state of an application, on the progress of a *process*, or on the existence of errors

### structure

- The way the parts of a *web page* are organized in relation to each other; and
- The way a collection of *web pages* is organized

### style property

property whose value determines the presentation (e.g. font, color, size, location, padding, volume, synthesized speech prosody) of content elements as they are rendered (e.g. onscreen, via loudspeaker, via braille display) by user agents
Style properties can have several origins:
- User agent default styles: The default style property values applied in the absence of any author or user styles. Some web content technologies specify a default rendering, others do not;
- Author styles: Style property values that are set by the author as part of the content (e.g. in-line styles, author style sheets);
- User styles: Style property values that are set by the user (e.g. via user agent interface settings, user style sheets)

### supplemental content

additional *content* that illustrates or clarifies the primary content

### synchronized media

*audio* or *video* synchronized with another format for presenting information and/or with time-based interactive components, unless the media is a *media alternative for text* that is clearly labeled as such

### target

region of the display that will accept a pointer action, such as the interactive area of a *user interface component*
> **Note:** If two or more targets are overlapping, the overlapping area should not be included in the measurement of the target size, except when the overlapping targets perform the same action or open the same page.

### technology (web content)

*mechanism* for encoding instructions to be rendered, played or executed by *user agents*
> **Note 1:** As used in these guidelines "web technology" and the word "technology" (when used alone) both refer to web content technologies.
> **Note 2:** Web content technologies may include markup languages, data formats, or programming languages that authors may use alone or in combination to create end-user experiences that range from static web pages to synchronized media presentations to dynamic Web applications.

### text

sequence of characters that can be *programmatically determined*, where the sequence is expressing something in *human language*

### text alternative

*Text* that is programmatically associated with *non-text content* or referred to from text that is programmatically associated with non-text content. Programmatically associated text is text whose location can be *programmatically determined* from the non-text content.
> **Note:** Refer to Understanding Text Alternatives for more information.

### up-event

platform event that occurs when the trigger stimulus of a pointer is released
The up-event may have different names on different platforms, such as "touchend" or "mouseup".

### used in an unusual or restricted way

words used in such a way that requires users to know exactly which definition to apply in order to understand the content correctly

### user agent

any software that retrieves and presents web content for users

### user inactivity

any continuous period of time where no user actions occur
The method of tracking will be determined by the website or application.

### user interface component

a part of the content that is perceived by users as a single control for a distinct function
> **Note 1:** Multiple user interface components may be implemented as a single programmatic element. "Components" here is not tied to programming techniques, but rather to what the user perceives as separate controls.
> **Note 2:** User interface components include form elements and links as well as components generated by scripts.
> **Note 3:** What is meant by "component" or "user interface component" here is also sometimes called "user interface element".

### user-controllable

data that is intended to be accessed by users
> **Note:** This does not refer to such things as Internet logs and search engine monitoring data.

### video

the technology of moving or sequenced pictures or images
> **Note:** Video can be made up of animated or photographic images, or both.

### video-only

a time-based presentation that contains only *video* (no *audio* and no interaction)

### viewport

object in which the *user agent* presents content
> **Note 1:** The user agent presents content through one or more viewports. Viewports include windows, frames, loudspeakers, and virtual magnifying glasses. A viewport may contain another viewport (e.g., nested frames). Interface components created by the user agent such as prompts, menus, and alerts are not viewports.
> **Note 2:** This definition is based on User Agent Accessibility Guidelines 1.0 Glossary [UAAG10].

### visually customized

the font, size, color, and background can be set

### web page

a non-embedded resource obtained from a single URI using HTTP plus any other resources that are used in the rendering or intended to be rendered together with it by a *user agent*
> **Note 1:** Although any "other resources" would be rendered together with the primary resource, they would not necessarily be rendered simultaneously with each other.
> **Note 2:** For the purposes of conformance with these guidelines, a resource must be "non-embedded" within the scope of conformance to be considered a web page.
