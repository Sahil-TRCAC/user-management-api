from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap

base = Path('screenshots')
base.mkdir(exist_ok=True)

items = {
    'env.png': {
        'title': 'Current .env settings',
        'content': 'PORT=5001\nMONGO_URI=mongodb+srv://saiyyedsahil59_db_user:*****@cluster0.jnxerji.mongodb.net/users-api?retryWrites=true&w=majority'
    },
    'server-status.png': {
        'title': 'Server startup status',
        'content': 'MongoDB connected successfully\nServer running in port 5001'
    },
    'api-response.png': {
        'title': 'API GET /api/users response',
        'content': '{"success":true,"message":"Users retrieved successfully","results":0,"total":0,"page":1,"limit":10,"data":[]}'
    }
}

font = ImageFont.load_default()
for filename, data in items.items():
    text = f"{data['title']}\n\n{data['content']}"
    lines = []
    for paragraph in text.split('\n'):
        lines.extend(textwrap.wrap(paragraph, width=70) or [''])
    width = 900
    ascent, descent = font.getmetrics()
    line_height = ascent + descent + 6
    height = line_height * len(lines) + 40
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    y = 20
    for line in lines:
        draw.text((20, y), line, fill='black', font=font)
        y += line_height
    image.save(base / filename)

print('Generated screenshots:')
for filename in items:
    print(f' - screenshots/{filename}')
