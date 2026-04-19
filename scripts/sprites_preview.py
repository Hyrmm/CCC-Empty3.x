"""Compose a dark-background contact sheet for alpha verification."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT_ROOT = Path(r"d:\cocosProject\CCC-Empty3.x\docs\images\sprites")
CHECK_PATH = Path(r"d:\cocosProject\CCC-Empty3.x\docs\images\sprites-alpha-check-dark.png")

DARK_BG = (28, 42, 52)
TILE = 320
PADDING = 24
COLS = 6
FONT_COLOR = (230, 230, 230)

samples = [
    ("characters", "char-budgie.png"),
    ("characters", "char-cat.png"),
    ("characters", "char-hedgehog.png"),
    ("customers", "customer-a.png"),
    ("customers", "customer-d-vip.png"),
    ("props", "prop-counter.png"),
    ("props", "prop-cash-register.png"),
    ("props", "prop-bugjar-rare.png"),
    ("props", "prop-bugjar-epic.png"),
    ("props", "prop-bugjar-scarab.png"),
    ("deco", "deco-sign.png"),
    ("deco", "deco-sale-tag.png"),
    ("deco", "deco-plant.png"),
    ("deco", "deco-frame.png"),
    ("ui", "ui-button-upgrade.png"),
    ("ui", "ui-button-codex.png"),
    ("ui", "ui-button-techtree.png"),
    ("ui", "ui-button-catchbugs.png"),
    ("ui", "ui-hud-coins.png"),
    ("ui", "ui-hud-scarab.png"),
    ("ui", "ui-hud-inventory.png"),
    ("ui", "ui-scroll-dots.png"),
    ("fx", "fx-speech-coin.png"),
    ("fx", "fx-speech-bug.png"),
    ("fx", "fx-floating-coins.png"),
]

rows = (len(samples) + COLS - 1) // COLS
W = COLS * TILE + PADDING * 2
H = rows * TILE + PADDING * 2
canvas = Image.new("RGB", (W, H), DARK_BG)
draw = ImageDraw.Draw(canvas)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 16)
except Exception:
    font = ImageFont.load_default()

for i, (cat, name) in enumerate(samples):
    path = OUT_ROOT / cat / name
    if not path.exists():
        continue
    im = Image.open(path).convert("RGBA")
    max_side = max(im.size)
    scale = (TILE - 40) / max_side
    new_size = (max(1, int(im.size[0] * scale)), max(1, int(im.size[1] * scale)))
    im = im.resize(new_size, Image.LANCZOS)
    col = i % COLS
    row = i // COLS
    tx = PADDING + col * TILE + (TILE - im.size[0]) // 2
    ty = PADDING + row * TILE + (TILE - im.size[1]) // 2
    canvas.paste(im, (tx, ty), im)
    draw.text((PADDING + col * TILE + 6, PADDING + row * TILE + TILE - 22), name, fill=FONT_COLOR, font=font)

canvas.save(CHECK_PATH)
print(f"wrote {CHECK_PATH}")
