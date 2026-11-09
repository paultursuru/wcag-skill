# WCAG 2.2: conformance

Text taken verbatim from the WCAG 2.2 W3C Recommendation 12 December 2024: https://www.w3.org/TR/WCAG22/
Only formatting was changed. The later W3C Editor's Draft 02 November 2026 is at https://w3c.github.io/wcag/guidelines/22/ and is not normative.
Extracted on 2026-11-09 by scripts/build_references.py. Copyright © 2020-2024 World Wide Web Consortium. W3C® liability, trademark and document use rules apply.
Copyright © 2023 W3C®. This software or document includes material copied from or derived from Web Content Accessibility Guidelines (WCAG) 2.2, https://www.w3.org/TR/WCAG22/.
Terms in *italics* are defined in glossary.md.

This section lists requirements for *conformance* to WCAG 2.2. It also gives information about how to make conformance claims, which are optional. Finally, it describes what it means to be *accessibility supported*, since only accessibility-supported ways of using technologies can be *relied upon* for conformance. Understanding Conformance includes further explanation of the accessibility-supported concept.
The main content of WCAG 2.2 is *normative* and defines requirements that impact conformance claims. Introductory material, appendices, sections marked as "non-normative", diagrams, examples, and notes are *informative* (non-normative). Non-normative material provides advisory information to help interpret the guidelines but does not create requirements that impact a conformance claim.
The key words MAY, MUST, MUST NOT, NOT RECOMMENDED, RECOMMENDED, SHOULD, and SHOULD NOT are to be interpreted as described in [RFC2119].
In order for a web page to conform to WCAG 2.2, all of the following conformance requirements must be satisfied:
One of the following levels of conformance is met in full.
- For Level A conformance (the minimum level of conformance), the *web page* *satisfies* all the Level A success criteria, or a *conforming alternate version* is provided.
- For Level AA conformance, the web page satisfies all the Level A and Level AA success criteria, or a Level AA conforming alternate version is provided.
- For Level AAA conformance, the web page satisfies all the Level A, Level AA and Level AAA success criteria, or a Level AAA conforming alternate version is provided.
> **Note 1:** Although conformance can only be achieved at the stated levels, authors are encouraged to report (in their claim) any progress toward meeting success criteria from all levels beyond the achieved level of conformance.
> **Note 2:** It is not recommended that Level AAA conformance be required as a general policy for entire sites because it is not possible to satisfy all Level AAA success criteria for some content.
*Conformance* (and conformance level) is for full *web page(s)* only, and cannot be achieved if part of a web page is excluded.
> **Note 1:** For the purpose of determining conformance, alternatives to part of a page's content are considered part of the page when the alternatives can be obtained directly from the page, e.g., a long description or an alternative presentation of a video.
> **Note 2:** Authors of web pages that cannot conform due to content outside of the author's control may consider a Statement of Partial Conformance.
> **Note 3:** A full page includes each variation of the page that is automatically presented by the page for various screen sizes (e.g. variations in a responsive web page). Each of these variations needs to conform (or needs to have a conforming alternate version) in order for the entire page to conform.
When a *web page* is one of a series of web pages presenting a *process* (i.e., a sequence of steps that need to be completed in order to accomplish an activity), all web pages in the process conform at the specified level or better. (Conformance is not possible at a particular level if any page in the process does not conform at that level or better.)
Only *accessibility-supported* ways of using *technologies* are *relied upon* to satisfy the success criteria. Any information or functionality that is provided in a way that is not accessibility supported is also available in a way that is accessibility supported. (See Understanding accessibility support.)
If *technologies* are used in a way that is not *accessibility supported*, or if they are used in a non-conforming way, then they do not block the ability of users to access the rest of the page. In addition, the *web page* as a whole continues to meet the conformance requirements under each of the following conditions:
1. when any technology that is not *relied upon* is turned on in a user agent,
2. when any technology that is not relied upon is turned off in a user agent, and
3. when any technology that is not relied upon is not supported by a user agent
In addition, the following success criteria apply to all content on the page, including content that is not otherwise relied upon to meet conformance, because failure to meet them could interfere with any use of the page:
- **1.4.2 - Audio Control**,
- **2.1.2 - No Keyboard Trap**,
- **2.3.1 - Three Flashes or Below Threshold**, and
- **2.2.2 - Pause, Stop, Hide**.
> **Note:** If a page cannot conform (for example, a conformance test page or an example page), it cannot be included in the scope of conformance or in a conformance claim.
For more information, including examples, see Understanding Conformance Requirements.
Conformance is defined only for *web pages*. However, a conformance claim may be made to cover one page, a series of pages, or multiple related web pages.
Conformance claims are **not required**. Authors can conform to WCAG 2.2 without making a claim. However, if a conformance claim is made, then the conformance claim **must** include the following information:
1. **Date** of the claim
2. **Guidelines title, version and URI** "Web Content Accessibility Guidelines 2.2 at https://www.w3.org/TR/WCAG22/"
3. **Conformance level** satisfied: (Level A, AA or AAA)
4. **A concise description of the web pages**, such as a list of URIs for which the claim is made, including whether subdomains are included in the claim.
  > **Note 1:** The web pages may be described by list or by an expression that describes all of the URIs included in the claim.
  > **Note 2:** Web-based products that do not have a URI prior to installation on the customer's website may have a statement that the product would conform when installed.
5. A list of the ***web content technologies* *relied upon***.
> **Note 3:** If a conformance logo is used, it would constitute a claim and must be accompanied by the required components of a conformance claim listed above.
In addition to the required components of a conformance claim above, consider providing additional information to assist users. Recommended additional information includes:
- A list of success criteria beyond the level of conformance claimed that have been met. This information should be provided in a form that users can use, preferably machine-readable metadata.
- A list of the specific technologies that are " used but not *relied upon*."
- A list of user agents, including assistive technologies that were used to test the content.
- A list of specific accessibility characteristics of the content, provided in machine-readable metadata.
- Information about any additional steps taken that go beyond the success criteria to enhance accessibility.
- A machine-readable metadata version of the list of specific technologies that are *relied upon*.
- A machine-readable metadata version of the conformance claim.
> **Note 1:** Refer to Understanding Conformance Claims for more information and example conformance claims.
> **Note 2:** Refer to Understanding Metadata for more information about the use of metadata in conformance claims.
Web pages that will later have additional content added can use a 'statement of partial conformance'. For example, an email program, a blog, an article that allows users to add comments, or applications supporting user-contributed content. Another example would be a page, such as a portal or news site, composed of content aggregated from multiple contributors, or sites that automatically insert content from other sources over time, such as when advertisements are inserted dynamically.
In these cases, it is not possible to know at the time of original posting what the uncontrolled content of the pages will be. It is important to note that the uncontrolled content can affect the accessibility of the controlled content as well. Two options are available:
1. A determination of conformance can be made based on best knowledge. If a page of this type is monitored and repaired (non-conforming content is removed or brought into conformance) within two business days, then a determination or claim of conformance can be made since, except for errors in externally contributed content which are corrected or removed when encountered, the page conforms. No conformance claim can be made if it is not possible to monitor or correct non-conforming content;
  **OR**
2. A "statement of partial conformance" may be made that the page does not conform, but could conform if certain parts were removed. The form of that statement would be, "This page does not conform, but would conform to WCAG 2.2 at level X if the following parts from uncontrolled sources were removed." In addition, the following would also be true of uncontrolled content that is described in the statement of partial conformance:
  1. It is not content that is under the author's control.
  2. It is described in a way that users can identify (e.g., they cannot be described as "all parts that we do not control" unless they are clearly marked as such.)
A "statement of partial conformance due to language" may be made when the page does not conform, but would conform if *accessibility support* existed for (all of) the language(s) used on the page. The form of that statement would be, "This page does not conform, but would conform to WCAG 2.2 at level X if accessibility support existed for the following language(s):"
This section is non-normative.
Success criteria within this specification which the Working Group has identified possible implications for privacy, either by providing protections for end users or which are important for website providers to take in to consideration when implementing features designed to protect user privacy, are listed below. This list reflects the current understanding of the Working Group but other Success criteria may have privacy implications that the Working Group is not aware of at the time of publishing.
Success criteria within this specification that may relate to privacy are:
- 2.2.6 Timeouts (AAA)
- 3.3.7 Redundant Entry (A)
This section is non-normative.
Success criteria within this specification which the Working Group has identified possible implications for security, either by providing protections for end users or which are important for website providers to take in to consideration when implementing features designed to protect user security, are listed below. This list reflects the current understanding of the Working Group but other Success criteria may have security implications that the Working Group is not aware of at the time of publishing.
Success criteria within this specification that may relate to security are:
- 1.1.1 Non-text Content (A)
- 1.3.5 Identify Input Purpose (AA)
- 1.4.7 Low or No Background Audio (AAA)
- 2.2.1 Timing Adjustable (A)
- 2.2.5 Re-authenticating (AAA)
- 2.2.6 Timeouts (AAA)
- 2.5.6 Concurrent Input Mechanisms (AAA)
- 3.3.3 Error Suggestion (AA)
- 3.3.7 Redundant Entry (A)
- 3.3.8 Accessible Authentication (Minimum) (AA)
- 3.3.9 Accessible Authentication (Enhanced) (AAA)
