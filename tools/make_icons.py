"""Draws the app icons (static/icon-*.png) and writes static/manifest.webmanifest.  Run: python make_icons.py"""
import json
import os

from PIL import Image, ImageDraw, ImageFont

STATIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")


def icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    # indigo gradient square with rounded corners
    grad = Image.new("RGBA", (size, size))
    px = grad.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            px[x, y] = (int(79 + (138 - 79) * t), int(91 + (134 - 91) * t), int(240 + (250 - 240) * t), 255)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.22), fill=255)
    img.paste(grad, (0, 0), mask)
    d = ImageDraw.Draw(img)
    font = None
    for name in ("arialbd.ttf", "segoeuib.ttf", "DejaVuSans-Bold.ttf"):
        try:
            font = ImageFont.truetype(name, int(size * 0.5))
            break
        except OSError:
            continue
    font = font or ImageFont.load_default()
    box = d.textbbox((0, 0), "LU", font=font)
    d.text(((size - (box[2] - box[0])) / 2 - box[0], (size - (box[3] - box[1])) / 2 - box[1] - size * 0.02), "LU", font=font, fill="white")
    # a small gold star over the U, the app's reward colour
    r = size * 0.07
    cx, cy = size * 0.79, size * 0.24
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 211, 77, 255))
    return img


for s in (180, 192, 512):
    icon(s).save(os.path.join(STATIC, f"icon-{s}.png"))

manifest = {
    "name": "Level Up", "short_name": "Level Up", "description": "Ingliz tili: darslar, o'yinlar va pomidor usuli",
    "start_url": "/", "scope": "/", "display": "fullscreen", "display_override": ["fullscreen", "standalone"],
    "orientation": "portrait", "background_color": "#eef0ff", "theme_color": "#4f5bf0",
    "icons": [{"src": "/static/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
              {"src": "/static/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}],
}
with open(os.path.join(STATIC, "manifest.webmanifest"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=1)
print("icons and manifest written")
