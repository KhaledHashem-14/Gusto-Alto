"""
Update menuData.json Image Paths
──────────────────────────────────
Run this AFTER optimize_images.py has created the WebP files.

WHAT IT DOES:
Walks through every item in menuData.json and rewrites its
imageUrl to point to the optimized WebP version, matched by
filename (so it doesn't matter what the original extension
or folder was).

Example:
    /images/oreo-milkshake.jpg  →  /images-optimized/oreo-milkshake.webp

USAGE:
    python update_image_paths.py
"""

import json
from pathlib import Path

# ── CONFIG — must match optimize_images.py settings ──────────
MENU_DATA_PATH = "src/data/menuData.json"   # adjust if different
NEW_IMAGE_FOLDER = "/images-optimized"      # the URL path the app will use
# ───────────────────────────────────────────────────────────────


def get_filename_stem(url_or_path: str) -> str:
    """Extract just the filename without extension, ignoring any URL/query params."""
    clean = url_or_path.split("?")[0]
    return Path(clean).stem


def update_image_paths():
    menu_path = Path(MENU_DATA_PATH)

    if not menu_path.exists():
        print(f"❌ menuData.json not found at: {menu_path.resolve()}")
        print("   Update MENU_DATA_PATH in this script to match your project.")
        return

    with open(menu_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0
    skipped = []

    for category in data.get("categories", []):
        for item in category.get("items", []):
            old_url = item.get("imageUrl", "")

            if not old_url:
                continue

            # Skip placeholder/external URLs that aren't local images
            if "img-placeholder" in old_url or old_url.startswith("http"):
                skipped.append((item.get("id", "?"), old_url))
                continue

            filename = get_filename_stem(old_url)
            new_url = f"{NEW_IMAGE_FOLDER}/{filename}.webp"

            item["imageUrl"] = new_url
            updated_count += 1

    with open(menu_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Updated {updated_count} image paths in {menu_path}")

    if skipped:
        print(f"\n⚠️  Skipped {len(skipped)} item(s) (placeholder or external URLs):")
        for item_id, url in skipped:
            print(f"   - {item_id}: {url}")


if __name__ == "__main__":
    update_image_paths()
