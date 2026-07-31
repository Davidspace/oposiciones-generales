from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageDraw


def page_number(path: Path) -> int:
    match = re.search(r"(\d+)(?=\.[^.]+$)", path.name)
    return int(match.group(1)) if match else 0


def build_contacts(folder: Path, per_sheet: int = 4, thumb_width: int = 620) -> list[Path]:
    pages = sorted(folder.glob("page-*.png"), key=page_number)
    outputs: list[Path] = []
    for start in range(0, len(pages), per_sheet):
        group = pages[start : start + per_sheet]
        thumbs = []
        for path in group:
            image = Image.open(path).convert("RGB")
            ratio = thumb_width / image.width
            thumb = image.resize((thumb_width, round(image.height * ratio)), Image.Resampling.LANCZOS)
            thumbs.append((path, thumb))
        columns = 2
        rows = (len(thumbs) + columns - 1) // columns
        label_height = 34
        gap = 24
        cell_height = max(thumb.height for _, thumb in thumbs) + label_height
        canvas = Image.new(
            "RGB",
            (
                columns * thumb_width + (columns + 1) * gap,
                rows * cell_height + (rows + 1) * gap,
            ),
            "white",
        )
        draw = ImageDraw.Draw(canvas)
        for index, (path, thumb) in enumerate(thumbs):
            row, col = divmod(index, columns)
            x = gap + col * (thumb_width + gap)
            y = gap + row * cell_height
            draw.text((x, y), f"Página {page_number(path)}", fill="black")
            canvas.paste(thumb, (x, y + label_height))
        first = page_number(group[0])
        last = page_number(group[-1])
        output = folder / f"contact-{first:02d}-{last:02d}.png"
        canvas.save(output, optimize=True)
        outputs.append(output)
    return outputs


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("folder", type=Path)
    parser.add_argument("--per-sheet", type=int, default=4)
    parser.add_argument("--width", type=int, default=620)
    args = parser.parse_args()
    outputs = build_contacts(args.folder, args.per_sheet, args.width)
    for output in outputs:
        print(output)


if __name__ == "__main__":
    main()
