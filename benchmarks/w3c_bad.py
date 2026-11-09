#!/usr/bin/env python3
"""Scores audit.mjs against the W3C Before and After Demonstration.

Runs the script on the four broken pages and their four fixed versions, reads the
failed criteria from the W3C's own reports, and prints what the script flagged.
A flagged criterion is not proof of finding the same defect: read the outputs.

Usage: python3 -I benchmarks/w3c_bad.py [OUTPUT_DIR]
"""
import re
import subprocess
import sys
import tempfile
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

BASE = 'https://www.w3.org/WAI/demos/bad'
PAGES = ['home', 'news', 'tickets', 'survey']
AUDIT = Path(__file__).resolve().parent.parent / 'skills' / 'wcag' / 'scripts' / 'audit.mjs'
# Obsolete and removed from WCAG 2.2.
REMOVED = {'4.1.1'}
CRITERION = re.compile(r'\d\.\d{1,2}\.\d{1,2}')
SIGNALS = {'VIOLATION:': 'violation', 'to check by hand:': 'by hand', 'suspect ': 'suspect'}


class Lines(HTMLParser):
    SKIP = {'script', 'style', 'head'}
    BLOCK = {'p', 'div', 'li', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'table', 'section'}

    def __init__(self):
        super().__init__()
        self.skipping = 0
        self.lines = ['']

    def handle_starttag(self, tag, attrs):
        self.skipping += tag in self.SKIP
        if tag in self.BLOCK:
            self.lines.append('')

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.skipping:
            self.skipping -= 1
        if tag in self.BLOCK:
            self.lines.append('')

    def handle_data(self, data):
        if not self.skipping:
            self.lines[-1] += ' '.join(data.split()) + ' '


def failed_criteria(page):
    """The A and AA criteria the W3C report marks as failed on this page."""
    with urllib.request.urlopen(f'{BASE}/before/reports/{page}.html') as response:
        parser = Lines()
        parser.feed(response.read().decode('utf-8', 'replace'))
    failed, current, level = set(), None, None
    for line in (l.strip() for l in parser.lines):
        if CRITERION.fullmatch(line):
            current, level = line, None
        elif current:
            found = re.search(r'\(Level (A{1,3})\)', line)
            level = level or (found and found.group(1))
            if line in ('Pass', 'Fail', 'Not applicable', 'Cannot tell'):
                if line == 'Fail' and level in ('A', 'AA') and current not in REMOVED:
                    failed.add(current)
                current = None
    return failed


def audit(version, page, out):
    """Runs the script and returns {criterion: signal}, keeping the strongest signal."""
    target = out / f'{version}-{page}'
    run = subprocess.run(
        ['node', str(AUDIT), f'{BASE}/{version}/{page}.html', '--out', str(target)],
        capture_output=True, text=True, check=False,
    )
    (out / f'{version}-{page}.txt').write_text(run.stdout + run.stderr, encoding='utf-8')
    if run.returncode not in (0, 1):
        sys.exit(f'audit.mjs failed on {version}/{page}, see {out}')
    found = {}
    for line in run.stdout.splitlines():
        text = line.strip()
        for prefix, signal in SIGNALS.items():
            if text.startswith(prefix):
                head = text.split(':', 2)[1] if prefix != 'suspect ' else text.split(':')[0]
                for criterion in CRITERION.findall(head):
                    if criterion not in found or list(SIGNALS.values()).index(signal) < list(SIGNALS.values()).index(found[criterion]):
                        found[criterion] = signal
        if 'DID NOT RUN' in text:
            print(f'  crashed rule on {version}/{page}: {text}')
    return found


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(tempfile.mkdtemp(prefix='w3c-bad-'))
    out.mkdir(parents=True, exist_ok=True)
    truth = {page: failed_criteria(page) for page in PAGES}
    before = {page: audit('before', page, out) for page in PAGES}
    after = {page: audit('after', page, out) for page in PAGES}

    every = sorted(set().union(*truth.values()), key=lambda c: [int(x) for x in c.split('.')])
    print('| Failed criterion (W3C) | ' + ' | '.join(PAGES) + ' |')
    print('|---|' + '---|' * len(PAGES))
    flagged = 0
    for criterion in every:
        cells = [before[p].get(criterion, '-') if criterion in truth[p] else 'n/a' for p in PAGES]
        flagged += any(cell not in ('-', 'n/a') for cell in cells)
        print(f'| {criterion} | ' + ' | '.join(cells) + ' |')
    print(f'\nFlagged on at least one page: {flagged} of {len(every)} criteria.')
    print('\nViolations on the fixed pages, which the W3C reports as passing WCAG 2.0:')
    for page in PAGES:
        print(f'  {page}:', sorted(c for c, s in after[page].items() if s == 'violation') or 'none')
    print('\nOutputs and screenshots in', out)


if __name__ == '__main__':
    main()
