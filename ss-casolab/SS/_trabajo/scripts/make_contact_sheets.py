from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def font(size: int):
    path = Path("C:/Windows/Fonts/arial.ttf")
    return ImageFont.truetype(str(path), size) if path.exists() else ImageFont.load_default()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--prefix", default="contacto")
    parser.add_argument("--per-sheet", type=int, default=12)
    args = parser.parse_args()

    pages = sorted(
        [
            *args.input_dir.glob("*.png"),
            *args.input_dir.glob("*.jpg"),
            *args.input_dir.glob("*.jpeg"),
        ]
    )
    args.output_dir.mkdir(parents=True, exist_ok=True)
    thumb_width = 270
    columns = 4
    label_height = 32
    margin = 18
    page_font = font(18)

    outputs = []
    for batch_index in range(0, len(pages), args.per_sheet):
        batch = pages[batch_index : batch_index + args.per_sheet]
        thumbs = []
        for path in batch:
            with Image.open(path) as source:
                source = source.convert("RGB")
                ratio = thumb_width / source.width
                thumb = source.resize(
                    (thumb_width, round(source.height * ratio)),
                    Image.Resampling.LANCZOS,
                )
            thumbs.append((path, thumb))
        thumb_height = max(image.height for _, image in thumbs)
        rows = (len(thumbs) + columns - 1) // columns
        width = margin + columns * (thumb_width + margin)
        height = margin + rows * (thumb_height + label_height + margin)
        sheet = Image.new("RGB", (width, height), "#DCE3EA")
        draw = ImageDraw.Draw(sheet)
        for index, (path, thumb) in enumerate(thumbs):
            row, column = divmod(index, columns)
            x = margin + column * (thumb_width + margin)
            y = margin + row * (thumb_height + label_height + margin)
            sheet.paste(thumb, (x, y))
            draw.text(
                (x, y + thumb_height + 5),
                path.stem,
                fill="#17365D",
                font=page_font,
            )
        output = args.output_dir / f"{args.prefix}_{batch_index // args.per_sheet + 1:02d}.png"
        sheet.save(output, optimize=True)
        outputs.append(output)

    for output in outputs:
        print(output)


if __name__ == "__main__":
    main()
