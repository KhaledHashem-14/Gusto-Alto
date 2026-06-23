"""
Image Optimizer — Resize + Convert to WebP
────────────────────────────────────────────
Run this ONCE locally to optimize all menu images.

WHAT IT DOES:
1. Reads every .jpg/.jpeg in INPUT_DIR
2. Resizes to MAX_SIZE (keeps aspect ratio, never upscales)
3. Saves as .webp in OUTPUT_DIR
4. Prints a before/after size report

SETUP:
    pip install Pillow

USAGE:
    python optimize_images.py

Then update your menuData.json imageUrl paths from:
    /images/oreo-milkshake.jpg
to:
    /images-optimized/oreo-milkshake.webp
"""

import os
from pathlib import Path
from PIL import Image

# ── CONFIG — adjust these to match your project ──────────────
INPUT_DIR = "public/images"
OUTPUT_DIR = "public/images-optimized"

# Your card displays images at 112x112 (w-28 h-28).
# 240px covers 2x retina with headroom. Increase if you ever
# show these images larger elsewhere (e.g. a detail view).
MAX_SIZE = 240

WEBP_QUALITY = 80  # 80 is visually lossless for photos; lower = smaller file
# ───────────────────────────────────────────────────────────────


def optimize_images():
    input_path = Path(INPUT_DIR)
    output_path = Path(OUTPUT_DIR)
    output_path.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        print(f"❌ Input folder not found: {input_path.resolve()}")
        print("   Update INPUT_DIR in this script to match your project structure.")
        return

    image_files = list(input_path.glob("*.jpg")) + list(input_path.glob("*.jpeg"))

    if not image_files:
        print(f"⚠️  No .jpg/.jpeg files found in {input_path.resolve()}")
        return

    total_before = 0
    total_after = 0
    results = []

    for img_file in image_files:
        try:
            size_before = img_file.stat().st_size
            total_before += size_before

            with Image.open(img_file) as img:
                # Convert to RGB (WebP doesn't support CMYK, and this
                # strips any orientation/color-profile weirdness)
                img = img.convert("RGB")

                # Resize only if larger than MAX_SIZE (never upscale)
                img.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

                out_file = output_path / (img_file.stem + ".webp")
                img.save(out_file, "WEBP", quality=WEBP_QUALITY, method=6)

            size_after = out_file.stat().st_size
            total_after += size_after

            saved_pct = 100 * (1 - size_after / size_before) if size_before else 0
            results.append((img_file.name, size_before, size_after, saved_pct))

        except Exception as e:
            print(f"⚠️  Failed on {img_file.name}: {e}")

    # ── Report ──
    print(f"\n{'File':<40} {'Before':>10} {'After':>10} {'Saved':>8}")
    print("─" * 72)
    for name, before, after, pct in results:
        print(f"{name:<40} {before/1024:>8.1f}KB {after/1024:>8.1f}KB {pct:>6.1f}%")

    print("─" * 72)
    print(f"{'TOTAL':<40} {total_before/1024:>8.1f}KB {total_after/1024:>8.1f}KB "
          f"{100*(1 - total_after/total_before):>6.1f}%" if total_before else "No files processed")
    print(f"\n✅ Done. {len(results)} images optimized → {output_path.resolve()}")
    print(f"\n👉 Next step: update imageUrl paths in menuData.json to point to")
    print(f"   '{OUTPUT_DIR.replace('public', '')}/<filename>.webp'")


if __name__ == "__main__":
    optimize_images()
