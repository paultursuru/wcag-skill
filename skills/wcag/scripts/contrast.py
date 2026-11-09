#!/usr/bin/env python3
"""WCAG contrast ratio, using the definitions of "contrast ratio" and "relative luminance".

  contrast.py FG BG [BG ...]              ratio of FG on each background
  contrast.py FG BG [BG ...] --fix 4.5    smallest change to FG that passes on all of them
  contrast.py FG BG --opacity 0.6 --under PAGE   FG and BG inside an element with CSS opacity

Colours: #rgb, #rrggbb, #rrggbbaa, rgb(), rgba(). A translucent BG is not supported:
composite it first, or pass the opaque colour the browser reports.
Ratios are floored, never rounded up: 4.499:1 does not meet 4.5:1.
"""
import argparse
import colorsys
import math
import re
import sys

THRESHOLDS = (
    (7.0, 'AAA text'),
    (4.5, 'AA text, AAA large text'),
    (3.0, 'AA large text, non-text (1.4.11)'),
)


def parse(value):
    value = value.strip()
    if value.startswith('#'):
        h = value[1:]
        if len(h) in (3, 4):
            h = ''.join(c * 2 for c in h)
        if len(h) not in (6, 8):
            raise ValueError(f'bad colour: {value}')
        return (*[int(h[i:i + 2], 16) for i in (0, 2, 4)], int(h[6:8], 16) / 255 if len(h) == 8 else 1.0)
    numbers = re.findall(r'[\d.]+%?', value)
    if not value.startswith('rgb') or len(numbers) not in (3, 4):
        raise ValueError(f'bad colour: {value}')
    alpha = 1.0
    if len(numbers) == 4:
        alpha = float(numbers[3].rstrip('%')) / (100 if numbers[3].endswith('%') else 1)
    return (float(numbers[0]), float(numbers[1]), float(numbers[2]), alpha)


def over(top, under):
    """Composite a colour on an opaque one."""
    a = top[3]
    return tuple(top[i] * a + under[i] * (1 - a) for i in range(3)) + (1.0,)


def channel(value):
    s = value / 255
    return s / 12.92 if s <= 0.04045 else ((s + 0.055) / 1.055) ** 2.4


def luminance(colour):
    return 0.2126 * channel(colour[0]) + 0.7152 * channel(colour[1]) + 0.0722 * channel(colour[2])


def ratio(a, b):
    high, low = sorted((luminance(a), luminance(b)), reverse=True)
    return (high + 0.05) / (low + 0.05)


def floored(value):
    return math.floor(value * 100) / 100


def to_hex(colour):
    return '#' + ''.join(f'{round(c):02x}' for c in colour[:3])


def verdict(value):
    passed = [name for limit, name in THRESHOLDS if value >= limit]
    return ('passes: ' + '; '.join(passed)) if passed else 'fails every threshold'


def worst(fg, backgrounds):
    return min(ratio(over(fg, bg), bg) for bg in backgrounds)


def fix(fg, backgrounds, target):
    """Raise the alpha of a translucent colour, otherwise move its lightness away from the background."""
    if worst(fg, backgrounds) >= target:
        return fg
    if fg[3] < 1:
        alpha = fg[3]
        while alpha < 1:
            alpha = round(alpha + 0.01, 2)
            candidate = fg[:3] + (alpha,)
            if worst(candidate, backgrounds) >= target:
                return candidate
    hue, light, sat = colorsys.rgb_to_hls(*[c / 255 for c in fg[:3]])
    direction = -1 if luminance(backgrounds[0]) > luminance(fg) else 1
    step = light
    while 0 <= step <= 1:
        step += direction * 0.001
        candidate = tuple(c * 255 for c in colorsys.hls_to_rgb(hue, min(max(step, 0), 1), sat)) + (1.0,)
        candidate = tuple(round(c) for c in candidate[:3]) + (1.0,)
        if worst(candidate, backgrounds) >= target:
            return candidate
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('fg')
    parser.add_argument('bg', nargs='+')
    parser.add_argument('--fix', type=float, metavar='RATIO')
    parser.add_argument('--opacity', type=float, help='CSS opacity of the element holding FG and BG')
    parser.add_argument('--under', help='opaque colour behind that element')
    args = parser.parse_args()

    try:
        fg = parse(args.fg)
        backgrounds = [parse(b) for b in args.bg]
    except ValueError as error:
        sys.exit(str(error))
    if any(b[3] < 1 for b in backgrounds):
        sys.exit('A background must be opaque: composite it first.')

    if args.opacity is not None:
        if not args.under or len(backgrounds) != 1:
            sys.exit('--opacity needs --under and a single background.')
        under = parse(args.under)
        painted_fg = over(fg, backgrounds[0])
        fg = over(painted_fg[:3] + (args.opacity,), under)
        backgrounds = [over(backgrounds[0][:3] + (args.opacity,), under)]
        print(f'painted: fg {to_hex(fg)} on bg {to_hex(backgrounds[0])}')

    for bg in backgrounds:
        value = ratio(over(fg, bg), bg)
        print(f'{floored(value):.2f}:1 on {to_hex(bg)}  ({verdict(value)})')

    if args.fix:
        result = fix(fg, backgrounds, args.fix)
        if result is None:
            print(f'--fix: no lightness reaches {args.fix}:1 on all these backgrounds')
            return
        shown = to_hex(result) if result[3] == 1 else f'rgba({result[0]:.0f},{result[1]:.0f},{result[2]:.0f},{result[3]:g})'
        rows = ', '.join(f'{floored(ratio(over(result, bg), bg)):.2f}:1 on {to_hex(bg)}' for bg in backgrounds)
        print(f'--fix {args.fix}: {shown}  ({rows})')


if __name__ == '__main__':
    main()
