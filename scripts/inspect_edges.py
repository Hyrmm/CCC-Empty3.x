"""Inspect the alpha edge of a sprite - print histograms of alpha and
pixel RGB samples around the boundary of the non-transparent region.

Usage: python inspect_edges.py path/to/sprite.png
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

p = Path(sys.argv[1])
im = np.array(Image.open(p).convert("RGBA"))
h, w = im.shape[:2]
rgb = im[..., :3]
a = im[..., 3]

print(f"File: {p}")
print(f"Size: {w}x{h}")

buckets = [0, 1, 16, 32, 64, 128, 192, 224, 240, 250, 254, 255, 256]
hist, _ = np.histogram(a, bins=buckets)
print("Alpha histogram:")
for lo, hi, c in zip(buckets[:-1], buckets[1:], hist):
    print(f"  [{lo:3d}-{hi-1:3d}]: {c}")

thin = (a > 0) & (a < 64)
if thin.any():
    sample = rgb[thin]
    print(f"Low-alpha (1-63) pixel count: {thin.sum()}")
    print(f"  avg rgb: {sample.mean(axis=0).round(1)}, min: {sample.min(axis=0)}, max: {sample.max(axis=0)}")

edges = (a > 0) & (a < 255)
if edges.any():
    ys, xs = np.where(edges)
    print(f"Edge pixels total: {edges.sum()}")
    print(f"  bbox of semi-transparent pixels: x[{xs.min()}..{xs.max()}], y[{ys.min()}..{ys.max()}]")
