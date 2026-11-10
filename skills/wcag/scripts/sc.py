#!/usr/bin/env python3
"""Prints the official text of WCAG 2.2 success criteria or glossary terms.

  sc.py 1.4.3 2.4.11        the criteria, with their notes and exceptions
  sc.py "large scale"       glossary terms starting with these words
"""
import re
import sys
from pathlib import Path

REFERENCES = Path(__file__).resolve().parent.parent / 'references'


def blocks(name, marker):
    """Maps each heading at this level to its lines, up to the next heading of any level."""
    found, title = {}, None
    for line in (REFERENCES / name).read_text(encoding='utf-8').splitlines():
        if line.startswith('#'):
            title = line[len(marker):] if line.startswith(marker) else None
            if title:
                found[title] = []
        elif title and line.strip():
            found[title].append(line)
    return found


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ('-h', '--help'):
        sys.exit(__doc__)
    criteria, terms, missing = None, None, []
    for query in sys.argv[1:]:
        if re.fullmatch(r'\d\.\d{1,2}\.\d{1,2}', query):
            criteria = criteria or blocks('success-criteria.md', '#### ')
            hits = [t for t in criteria if t.startswith(query + ' ')]
        else:
            terms = terms or blocks('glossary.md', '### ')
            hits = [t for t in terms if t.lower().startswith(query.lower())]
        if not hits:
            missing.append(query)
        for title in hits:
            print(title)
            print('\n'.join((criteria if title in (criteria or {}) else terms)[title]) + '\n')
    if missing:
        sys.exit(f'not found: {", ".join(missing)}')


if __name__ == '__main__':
    main()
