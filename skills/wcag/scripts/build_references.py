#!/usr/bin/env python3
"""Regenerate references/{success-criteria,glossary,conformance}.md from the WCAG 2.2 HTML.

Usage (run with -I, the HTML is downloaded data):
  python3 -I build_references.py RECOMMENDATION.html DRAFT.html OUTPUT_DIR

The Recommendation provides the text. The Editor's Draft is only compared against it.
Standard library only.
"""
import difflib
import re
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
SKIP = {'doclinks', 'header-wrapper', 'self-link', 'dfn-panel', 'conformance-level', 'screenreader', 'marker'}
BLOCK = {'p', 'ul', 'ol', 'dl', 'div', 'section', 'li', 'dd', 'dt', 'table', 'blockquote', 'h1', 'h2', 'h3', 'h4',
         'h5', 'h6', 'details', 'pre'}
UNDERSTANDING = 'https://www.w3.org/WAI/WCAG22/Understanding/'


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent, self.kids = tag, dict(attrs or []), parent, []

    @property
    def classes(self):
        return (self.attrs.get('class') or '').split()


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.kids.append(node)
        if tag not in VOID:
            self.current = node

    def handle_endtag(self, tag):
        node = self.current
        while node is not self.root and node.tag != tag:
            node = node.parent
        if node is not self.root:
            self.current = node.parent

    def handle_data(self, data):
        self.current.kids.append(data)


def walk(node):
    for kid in node.kids:
        if isinstance(kid, Node):
            yield kid
            yield from walk(kid)


def plain(node):
    return re.sub(r'\s+', ' ', ''.join(k if isinstance(k, str) else plain(k) for k in node.kids)).strip()


def skipped(node):
    return node.tag in ('script', 'style', 'aside') or bool(SKIP & set(node.classes))


def inline(node):
    out = ''
    for kid in node.kids:
        if isinstance(kid, str):
            out += kid
        elif skipped(kid):
            continue
        elif kid.tag == 'a' and 'internalDFN' in kid.classes:
            out += '*' + inline(kid).strip() + '*'
        elif kid.tag in ('strong', 'b'):
            out += '**' + inline(kid).strip() + '**'
        elif kid.tag == 'code':
            out += '`' + inline(kid).strip() + '`'
        elif kid.tag == 'br':
            out += ' '
        else:
            out += inline(kid)
    return re.sub(r'\s+', ' ', out)


def wrap(kid):
    box = Node('box')
    box.kids = [kid]
    return inline(box)


def blocks(node, indent=''):
    lines, buffer = [], []

    def flush():
        text = re.sub(r'\s+', ' ', ''.join(buffer)).strip()
        buffer.clear()
        if text:
            lines.append(indent + text)

    for kid in node.kids:
        if isinstance(kid, str):
            buffer.append(kid)
        elif skipped(kid):
            continue
        elif kid.tag == 'div' and 'note' in kid.classes:
            flush()
            body = [l for l in blocks(kid) if l.strip() and l.strip() not in ('Note', 'Note:')]
            title = next((plain(m) for m in walk(kid) if 'marker' in m.classes), 'Note')
            lines.append(f'{indent}> **{title.rstrip(":")}:** {body[0].lstrip()}')
            lines += [f'{indent}> {b.lstrip()}' for b in body[1:]]
        elif kid.tag in ('ul', 'ol'):
            flush()
            items = [x for x in kid.kids if isinstance(x, Node) and x.tag == 'li']
            for i, item in enumerate(items):
                sub = blocks(item, indent + '  ')
                if sub:
                    bullet = f'{i + 1}. ' if kid.tag == 'ol' else '- '
                    lines.append(indent + bullet + sub[0].strip())
                    lines += sub[1:]
        elif kid.tag == 'dl':
            flush()
            term = None
            for x in kid.kids:
                if not isinstance(x, Node):
                    continue
                if x.tag == 'dt':
                    term = inline(x).strip()
                elif x.tag == 'dd':
                    sub = blocks(x, indent + '  ')
                    lines.append(f'{indent}- **{term}:** {sub[0].strip() if sub else ""}')
                    lines += sub[1:]
        elif kid.tag == 'table':
            flush()
            lines.append(indent + '[table omitted, see the source document]')
        elif kid.tag in BLOCK:
            flush()
            lines += blocks(kid, indent)
        else:
            buffer.append(wrap(kid))
    flush()
    return lines


def without_subsections(section):
    box = Node('box')
    box.kids = [k for k in section.kids if not (isinstance(k, Node) and k.tag == 'section')]
    return box


def parse(path):
    tree = Tree()
    tree.feed(Path(path).read_text(encoding='utf-8'))
    sections = [n for n in walk(tree.root) if n.tag == 'section']
    doc = {'principles': [], 'guidelines': [], 'sc': [], 'glossary': {}, 'conformance': []}
    for section in sections:
        heading = next((k for k in walk(section) if k.tag in ('h2', 'h3', 'h4', 'h5')), None)
        if not heading:
            continue
        label = plain(heading)
        if 'principle' in section.classes:
            m = re.match(r'(?:Principle\s+)?(\d)\.?\s*(.*)', label)
            doc['principles'].append({'num': m.group(1), 'title': m.group(2),
                                      'text': ' '.join(blocks(without_subsections(section)))})
        m = re.match(r'Guideline (\d\.\d+)\s*(.*)', label)
        if m:
            doc['guidelines'].append({'num': m.group(1), 'title': m.group(2),
                                      'text': ' '.join(blocks(without_subsections(section)))})
        m = re.match(r'Success Criterion (\d\.\d+\.\d+)\s*(.*)', label)
        if m:
            level = next((plain(k) for k in walk(section) if 'conformance-level' in k.classes), '')
            link = next((k.attrs.get('href', '') for k in walk(section)
                         if k.tag == 'a' and plain(k).startswith('Understanding')), '')
            slug = re.search(r'([\w-]+)\.html', link)
            doc['sc'].append({'num': m.group(1), 'title': m.group(2),
                              'level': re.sub(r'[^A]', '', level),
                              'understanding': f'{UNDERSTANDING}{slug.group(1)}.html' if slug else '',
                              'md': [l for l in blocks(section) if l.strip() != 'New']})
    by_id = {s.attrs.get('id'): s for s in sections}
    doc['conformance'] = blocks(by_id['conformance'])
    glossary = by_id.get('terms') or by_id.get('glossary')
    for dl in (n for n in walk(glossary) if n.tag == 'dl'):
        term = None
        for kid in dl.kids:
            if not isinstance(kid, Node):
                continue
            if kid.tag == 'dt':
                term = plain(kid)
            elif kid.tag == 'dd' and term and term not in doc['glossary']:
                doc['glossary'][term] = blocks(kid)
    doc['status'] = next((plain(n) for n in walk(tree.root) if n.attrs.get('id') == 'w3c-state'), '')
    doc['copyright'] = next((plain(n) for n in walk(tree.root) if 'copyright' in n.classes), '')
    return doc


def changed_lines(old, new):
    return [l for l in difflib.unified_diff(old, new, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))]


def header(title, source, compared):
    return [
        f'# {title}', '',
        f'Text taken verbatim from the WCAG 2.2 {source["status"]}: https://www.w3.org/TR/WCAG22/',
        f'Only formatting was changed. The later {compared["status"]} is at https://w3c.github.io/wcag/guidelines/22/ and is not normative.',
        f'Extracted on {date.today().isoformat()} by scripts/build_references.py. {source["copyright"]}',
        'Copyright © 2023 W3C®. This software or document includes material copied from or derived from '
        'Web Content Accessibility Guidelines (WCAG) 2.2, https://www.w3.org/TR/WCAG22/.',
        'Terms in *italics* are defined in glossary.md.', '',
    ]


def write_all(source, compared, out):
    later = {s['num']: s for s in compared['sc']}
    lines = header('WCAG 2.2: success criteria', source, compared)
    lines += ['Print one with: `python3 scripts/sc.py 1.4.3`.', '']
    lines += ["## Differences with the Editor's Draft", '',
              "These do not change the requirements in force. A `-` line is the text below, a `+` line is the draft.", '']
    differing = [s for s in source['sc'] if s['md'] != later[s['num']]['md']]
    for s in differing:
        lines.append(f'- **{s["num"]} {s["title"]}**')
        lines += [f'  - `{l[0]}` {l[1:]}' for l in changed_lines(s['md'], later[s['num']]['md'])]
    lines += ['', '## Contents', '']
    for g in source['guidelines']:
        count = sum(s['num'].startswith(g['num'] + '.') for s in source['sc'])
        lines.append(f'- {g["num"]} {g["title"]} ({count})')
    lines.append('')
    for p in source['principles']:
        lines += [f'## Principle {p["num"]}. {p["title"]}', '', p['text'], '']
        for g in (g for g in source['guidelines'] if g['num'].startswith(p['num'] + '.')):
            lines += [f'### Guideline {g["num"]} {g["title"]}', '', g['text'], '']
            for s in (s for s in source['sc'] if s['num'].startswith(g['num'] + '.')):
                level = f' (Level {s["level"]})' if s['level'] else ''
                lines += [f'#### {s["num"]} {s["title"]}{level}', '', f'Understanding: {s["understanding"]}', '']
                lines += s['md'] + ['']
    (out / 'success-criteria.md').write_text('\n'.join(lines), encoding='utf-8')

    lines = header('WCAG 2.2: glossary', source, compared)
    lines += ['Print one with: `python3 scripts/sc.py "contrast ratio"`.', '']
    for term, body in sorted(source['glossary'].items(), key=lambda kv: kv[0].lower()):
        lines += [f'### {term}', ''] + (body or []) + ['']
    (out / 'glossary.md').write_text('\n'.join(lines), encoding='utf-8')

    lines = header('WCAG 2.2: conformance', source, compared) + source['conformance'] + ['']
    (out / 'conformance.md').write_text('\n'.join(lines), encoding='utf-8')
    return differing


if __name__ == '__main__':
    source, compared = parse(sys.argv[1]), parse(sys.argv[2])
    out = Path(sys.argv[3])
    differing = write_all(source, compared, out)
    levels = {lv: sum(s['level'] == lv for s in source['sc']) for lv in ('A', 'AA', 'AAA', '')}
    print(source['status'], '|', compared['status'])
    print('criteria', len(source['sc']), levels, '| glossary', len(source['glossary']), '| differing from draft',
          [s['num'] for s in differing])
