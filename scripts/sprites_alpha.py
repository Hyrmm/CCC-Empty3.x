"""Convert AI-generated sprites on pure-white backgrounds into clean
transparent PNGs, without dark halos on the edge.

Key design decisions:
- Only pixels whose white region is CONNECTED to the canvas edge via flood
  fill are treated as real background. Interior cream/white areas (eye
  highlights, button text, paper labels) stay fully opaque.
- Anti-aliased edge pixels get an alpha derived from "how saturated or how
  far from pure white" they are. We use the straight chroma-key formula
  alpha = 1 - min(r,g,b)/255 which is mathematically consistent with the
  over-white compositing equation px = c*a + 255*(1-a).
- Decontamination un-premultiplies the white: c = (px - 255*(1-a)) / a,
  with clamping and a safety floor so tiny-alpha pixels never produce
  negative RGB that would read as a dark halo.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, label

SRC_DIR = Path(r"C:\Users\13581\.cursor\projects\d-cocosProject-CCC-Empty3-x\assets")
OUT_ROOT = Path(r"d:\cocosProject\CCC-Empty3.x\docs\images\sprites")

CATEGORY_MAP = {
    "sprite-char-": "characters",
    "sprite-customer-": "customers",
    "sprite-prop-": "props",
    "sprite-deco-": "deco",
    "sprite-ui-": "ui",
    "sprite-fx-": "fx",
}

TILES_KEEP_OPAQUE = {"sprite-deco-floor-tile.png", "sprite-deco-wall-tile.png"}

BG_LUM_MIN = 240
BG_SAT_MAX = 0.06
EDGE_BAND = 4
ALPHA_FLOOR = 0.08
CROP_MARGIN = 16


def saturation(rgb: np.ndarray) -> np.ndarray:
    mx = rgb.max(axis=-1).astype(np.float32)
    mn = rgb.min(axis=-1).astype(np.float32)
    return np.where(mx > 0, (mx - mn) / np.maximum(mx, 1.0), 0.0)


def luminance(rgb: np.ndarray) -> np.ndarray:
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def build_bg_mask(rgb: np.ndarray) -> np.ndarray:
    lum = luminance(rgb)
    sat = saturation(rgb)
    white_like = (lum >= BG_LUM_MIN) & (sat <= BG_SAT_MAX)

    labeled, n = label(white_like)
    if n == 0:
        return np.zeros(rgb.shape[:2], dtype=bool)

    h, w = rgb.shape[:2]
    edge_labels = set()
    for y in (0, h - 1):
        edge_labels.update(np.unique(labeled[y, :]).tolist())
    for x in (0, w - 1):
        edge_labels.update(np.unique(labeled[:, x]).tolist())
    edge_labels.discard(0)
    if not edge_labels:
        return np.zeros(rgb.shape[:2], dtype=bool)
    return np.isin(labeled, list(edge_labels))


def process_sprite(path: Path) -> Path:
    category = next((v for k, v in CATEGORY_MAP.items() if path.name.startswith(k)), "misc")
    out_dir = OUT_ROOT / category
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / path.name.replace("sprite-", "")

    src = Image.open(path).convert("RGB")

    if path.name in TILES_KEEP_OPAQUE:
        src.save(out_path)
        return out_path

    rgb = np.array(src).astype(np.float32)
    bg_mask = build_bg_mask(rgb.astype(np.uint8))

    if not bg_mask.any():
        out_rgba = np.dstack([rgb.astype(np.uint8), np.full(rgb.shape[:2], 255, dtype=np.uint8)])
        Image.fromarray(out_rgba).save(out_path)
        return out_path

    struct = np.ones((3, 3), dtype=bool)
    bg_dilated = binary_dilation(bg_mask, structure=struct, iterations=EDGE_BAND)
    band = bg_dilated & ~bg_mask

    alpha01 = np.ones(rgb.shape[:2], dtype=np.float32)
    alpha01[bg_mask] = 0.0

    if band.any():
        band_rgb = rgb[band]
        min_channel = band_rgb.min(axis=1)
        band_alpha = 1.0 - min_channel / 255.0
        band_alpha = np.where(band_alpha < ALPHA_FLOOR, 0.0, band_alpha)
        alpha01[band] = band_alpha

    alpha01 = np.clip(alpha01, 0.0, 1.0)

    out_rgb = rgb.copy()
    decontam_mask = (alpha01 > 0.0) & (alpha01 < 1.0)
    if decontam_mask.any():
        a = alpha01[decontam_mask][:, None]
        px = rgb[decontam_mask]
        decomp = (px - 255.0 * (1.0 - a)) / a
        decomp = np.clip(decomp, 0.0, 255.0)
        out_rgb[decontam_mask] = decomp

    alpha_u8 = (alpha01 * 255.0).astype(np.uint8)
    out_rgba = np.dstack([out_rgb.astype(np.uint8), alpha_u8])

    ys, xs = np.where(alpha_u8 > 0)
    if ys.size:
        y0 = max(0, int(ys.min()) - CROP_MARGIN)
        y1 = min(rgb.shape[0], int(ys.max()) + 1 + CROP_MARGIN)
        x0 = max(0, int(xs.min()) - CROP_MARGIN)
        x1 = min(rgb.shape[1], int(xs.max()) + 1 + CROP_MARGIN)
        out_rgba = out_rgba[y0:y1, x0:x1]

    Image.fromarray(out_rgba).save(out_path)
    return out_path


def main() -> None:
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    sprites = sorted(SRC_DIR.glob("sprite-*.png"))
    print(f"Found {len(sprites)} raw sprites")
    for p in sprites:
        out = process_sprite(p)
        print(f"  {p.name} -> {out.relative_to(OUT_ROOT.parent.parent.parent)}")


if __name__ == "__main__":
    main()
