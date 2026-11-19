"""Build public/fonts/mann-display-wght.woff2 ("Mann Display").

Mona Sans (GitHub, SIL OFL 1.1, Reserved Font Name "Mona") pinned to its Expanded width (wdth 125), weight 500-800 kept
variable, subset to Latin basic and the punctuation the site uses. This is a Modified Version, so it is renamed.
Needs: pip install fonttools brotli; the Fontsource package @fontsource-variable/mona-sans (a devDependency).
"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

SRC = 'node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2'
OUT = 'public/fonts/mann-display-wght.woff2'

font = TTFont(SRC, lazy=False)
font = instancer.instantiateVariableFont(font, {'wdth': 125, 'wght': (500, 800)})
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['kern', 'liga', 'calt', 'tnum', 'case']
opts.hinting = False
opts.name_IDs = ['*']
unicodes = list(range(0x20, 0x7F)) + [0xA0, 0xA9, 0xB7, 0xD7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2191, 0x2192, 0x2193, 0x2197]
sub = subset.Subsetter(opts)
sub.populate(unicodes=unicodes)
sub.subset(font)
for rec in font['name'].names:
    try:
        value = rec.toUnicode()
    except Exception:
        continue
    new = value.replace('Mona Sans', 'Mann Display').replace('MonaSans', 'MannDisplay')
    if rec.nameID in (1, 16):
        new = 'Mann Display'
    if new != value:
        rec.string = new
font.flavor = 'woff2'
font.save(OUT)
print('wrote', OUT)
