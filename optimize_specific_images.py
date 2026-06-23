"""
Optimize Specific Images — One-off batch
──────────────────────────────────────────
Run this to optimize ONLY the 4 new images below, instead of
re-running the optimizer on your entire image folder.

WHAT IT DOES:
Same as optimize_images.py (resize + convert to WebP), but only
for the filenames listed in FILES_TO_PROCESS.

SETUP:
    pip3 install Pillow

USAGE:
    python3 optimize_specific_images.py

Place the original .jpg/.jpeg files in INPUT_DIR with these
exact names (case-sensitive) before running:
    turkish-coffee.jpg (or .jpeg)
    double-turkish-coffee.jpg (or .jpeg)
    single-espresso.jpg (or .jpeg)
    espresso.jpg (or .jpeg)
"""

from pathlib import Path
from PIL import Image

# ── CONFIG — must match your project structure ───────────────
INPUT_DIR = "public/images"
OUTPUT_DIR = "public/images-optimized"

MAX_SIZE = 240        # matches your card display size (112px @ 2x retina)
WEBP_QUALITY = 80

# Only these filenames will be processed (without extension —
# the script tries .jpg then .jpeg automatically)
FILES_TO_PROCESS = [
    "turkish-coffee",
    "double-turkish-coffee",
    "single-espresso",
    "espresso",
]
# ───────────────────────────────────────────────────────────────


def find_source_file(input_path: Path, stem: str) -> Path | None:
    for ext in (".jpg", ".jpeg", ".JPG", ".JPEG", ".png"):
        candidate = input_path / f"{stem}{ext}"
        if candidate.exists():
            return candidate
    return None


def optimize_specific_images():
    input_path = Path(INPUT_DIR)
    output_path = Path(OUTPUT_DIR)
    output_path.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        print(f"❌ Input folder not found: {input_path.resolve()}")
        return

    results = []

    for stem in FILES_TO_PROCESS:
        src_file = find_source_file(input_path, stem)

        if not src_file:
            print(f"⚠️  Source file not found for '{stem}' (looked for .jpg/.jpeg/.png in {input_path})")
            continue

        size_before = src_file.stat().st_size

        with Image.open(src_file) as img:
            img = img.convert("RGB")
            img.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

            out_file = output_path / f"{stem}.webp"
            img.save(out_file, "WEBP", quality=WEBP_QUALITY, method=6)

        size_after = out_file.stat().st_size
        saved_pct = 100 * (1 - size_after / size_before) if size_before else 0
        results.append((stem, size_before, size_after, saved_pct))

    if not results:
        print("\n❌ No images were processed. Check filenames/paths above.")
        return

    print(f"\n{'File':<28} {'Before':>10} {'After':>10} {'Saved':>8}")
    print("─" * 60)
    for name, before, after, pct in results:
        print(f"{name:<28} {before/1024:>8.1f}KB {after/1024:>8.1f}KB {pct:>6.1f}%")

    print(f"\n✅ Done. {len(results)} image(s) optimized → {output_path.resolve()}")
    print("👉 No menuData.json changes needed — paths are already set.")


if __name__ == "__main__":
    optimize_specific_images()
