from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path("/private/tmp/wc-kit-matchups")
OUTPUT_DIR = ROOT / "public" / "kits" / "matches"

# The 36 source images are 1600 x 1600 FIFA match coordination pages.
# Each page contains two matches; these boxes crop only the player kit
# combination: shirt, shorts, and socks.
CROP_BOXES = {
    "top_home": (318, 404, 575, 490),
    "top_away": (895, 404, 1157, 490),
    "bottom_home": (318, 944, 575, 1030),
    "bottom_away": (895, 944, 1157, 1030),
}


def is_background_like(pixel: tuple[int, int, int, int], threshold: int = 242) -> bool:
    r, g, b, alpha = pixel
    brightness = (r + g + b) / 3
    saturation = max(r, g, b) - min(r, g, b)

    return alpha == 0 or (brightness >= threshold and saturation <= 14)


def remove_connected_background(image: Image.Image) -> Image.Image:
    crop = image.copy().convert("RGBA")
    pixels = crop.load()
    width, height = crop.size
    background = [[False] * height for _ in range(width)]
    queue: deque[tuple[int, int]] = deque()

    def add_if_background(x: int, y: int) -> None:
        if not background[x][y] and is_background_like(pixels[x, y]):
            background[x][y] = True
            queue.append((x, y))

    for x in range(width):
        add_if_background(x, 0)
        add_if_background(x, height - 1)

    for y in range(height):
        add_if_background(0, y)
        add_if_background(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for next_x, next_y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= next_x < width and 0 <= next_y < height:
                add_if_background(next_x, next_y)

    for x in range(width):
        for y in range(height):
            if background[x][y]:
                pixels[x, y] = (255, 255, 255, 0)

    return crop


def touches_transparency(
    pixels,
    width: int,
    height: int,
    x: int,
    y: int,
) -> bool:
    for next_x in range(max(0, x - 1), min(width, x + 2)):
        for next_y in range(max(0, y - 1), min(height, y + 2)):
            if pixels[next_x, next_y][3] == 0:
                return True

    return False


def remove_light_edge_fringe(image: Image.Image) -> Image.Image:
    pixels = image.load()
    width, height = image.size

    for _ in range(4):
        operations: list[tuple[int, int, int, int, int, int]] = []

        for x in range(width):
            for y in range(height):
                r, g, b, alpha = pixels[x, y]
                if alpha == 0:
                    continue

                brightness = (r + g + b) / 3
                saturation = max(r, g, b) - min(r, g, b)

                if brightness <= 210 or saturation >= 70:
                    continue

                if not touches_transparency(pixels, width, height, x, y):
                    continue

                neighbours: list[tuple[int, int, int]] = []

                for next_x in range(max(0, x - 4), min(width, x + 5)):
                    for next_y in range(max(0, y - 4), min(height, y + 5)):
                        next_r, next_g, next_b, next_alpha = pixels[next_x, next_y]
                        if next_alpha == 0:
                            continue

                        next_brightness = (next_r + next_g + next_b) / 3
                        next_saturation = max(next_r, next_g, next_b) - min(next_r, next_g, next_b)

                        if next_saturation > 45 or next_brightness < 190:
                            neighbours.append((next_r, next_g, next_b))

                if len(neighbours) >= 2:
                    avg_r = sum(value[0] for value in neighbours) // len(neighbours)
                    avg_g = sum(value[1] for value in neighbours) // len(neighbours)
                    avg_b = sum(value[2] for value in neighbours) // len(neighbours)

                    operations.append(
                        (
                            x,
                            y,
                            int(r * 0.25 + avg_r * 0.75),
                            int(g * 0.25 + avg_g * 0.75),
                            int(b * 0.25 + avg_b * 0.75),
                            min(alpha, 210),
                        )
                    )
                elif brightness > 238 and saturation < 28:
                    operations.append((x, y, r, g, b, min(alpha, 95)))

        if not operations:
            break

        for x, y, r, g, b, alpha in operations:
            pixels[x, y] = (r, g, b, alpha)

    return image


def trim_alpha(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image

    width, height = image.size
    padding = 5

    return image.crop(
        (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(width, bbox[2] + padding),
            min(height, bbox[3] + padding),
        )
    )


def cutout(image: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    cropped = image.crop(box).convert("RGBA")
    without_background = remove_connected_background(cropped)
    defringed = remove_light_edge_fringe(without_background)

    return trim_alpha(defringed)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    generated = 0

    for page in range(1, 37):
        source_path = SOURCE_DIR / f"{page + 1:02d}.jpg"
        source = Image.open(source_path)

        for position, offset in (("top", 1), ("bottom", 2)):
            match_number = (page - 1) * 2 + offset

            for side in ("home", "away"):
                asset = cutout(source, CROP_BOXES[f"{position}_{side}"])
                asset.save(OUTPUT_DIR / f"m{match_number}-{side}.png", optimize=True)
                generated += 1

    print(f"Generated {generated} transparent match kit assets in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
