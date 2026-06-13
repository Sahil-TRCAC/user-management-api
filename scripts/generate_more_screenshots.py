from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, textwrap

base = Path('screenshots')
base.mkdir(exist_ok=True)

tests = {
    'get-users.png': 'tests/get_all.json',
    'update-user.png': 'tests/updated.json',
    'delete-user.png': 'tests/deleted.json'
}

font = ImageFont.load_default()
for outname, src in tests.items():
    p = Path(src)
    if not p.exists():
        content = f'File not found: {src}'
    else:
        data = json.loads(p.read_text())
        pretty = json.dumps(data, indent=2)
        content = pretty
    title = outname.replace('-', ' ').replace('.png','').title()
    lines = []
    for paragraph in content.split('\n'):
        lines.extend(textwrap.wrap(paragraph, width=80) or [''])
    width = 1000
    ascent, descent = font.getmetrics()
    line_height = ascent + descent + 6
    height = line_height * (len(lines)+2) + 40
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    y = 20
    draw.text((20, y), title, fill='black', font=font)
    y += line_height*2
    for line in lines:
        draw.text((20, y), line, fill='black', font=font)
        y += line_height
    image.save(base / outname)
    print('Wrote', base / outname)
