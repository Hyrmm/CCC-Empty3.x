"""Crop a landscape shop mockup into a 9:16 portrait version.

Strategy: keep the full landscape content centered, extend the top and bottom
with a blurred upscaled copy so the side UI (menu buttons, Add Counter slots)
is not lost. This is a quick local crop for preview use; the original stays
as the landscape promotional image.
"""
from pathlib import Path
from PIL import Image, ImageFilter

SRC = Path(r"C:\Users\13581\.cursor\projects\d-cocosProject-CCC-Empty3-x\assets\budgie-bug-shop-ui-mockup-portrait-v3.png")
OUT_DIR = Path(r"d:\cocosProject\CCC-Empty3.x\docs\images")
OUT_DIR.mkdir(parents=True, exist_ok=True)

LANDSCAPE_OUT = OUT_DIR / "shop-main-landscape.png"
PORTRAIT_OUT = OUT_DIR / "shop-main-portrait-9x16.png"

TARGET_W, TARGET_H = 1080, 1920

src = Image.open(SRC).convert("RGB")
src.save(LANDSCAPE_OUT)

fg_w = TARGET_W
fg_h = round(src.height * (TARGET_W / src.width))
fg = src.resize((fg_w, fg_h), Image.LANCZOS)

bg_scale = max(TARGET_W / src.width, TARGET_H / src.height)
bg_w = round(src.width * bg_scale)
bg_h = round(src.height * bg_scale)
bg = src.resize((bg_w, bg_h), Image.LANCZOS)
left = (bg_w - TARGET_W) // 2
top = (bg_h - TARGET_H) // 2
bg = bg.crop((left, top, left + TARGET_W, top + TARGET_H))
bg = bg.filter(ImageFilter.GaussianBlur(radius=40))

canvas = Image.new("RGB", (TARGET_W, TARGET_H))
canvas.paste(bg, (0, 0))
paste_y = (TARGET_H - fg_h) // 2
canvas.paste(fg, (0, paste_y))
canvas.save(PORTRAIT_OUT)

print("landscape ->", LANDSCAPE_OUT)
print("portrait  ->", PORTRAIT_OUT, canvas.size)
