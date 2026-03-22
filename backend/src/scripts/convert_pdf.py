#!/usr/bin/env python3
"""
PDF Conversion Microservice
Handles: pdf->docx, pdf->xlsx, pdf->pptx

Usage:
  python convert_pdf.py <mode> <input_path> <output_path>

Modes:
  docx   Convert PDF to Word
  xlsx   Convert PDF to Excel
  pptx   Convert PDF to PowerPoint (each page becomes a slide image)
"""

import sys
import os


def pdf_to_docx(input_path: str, output_path: str) -> None:
    from pdf2docx import Converter
    cv = Converter(input_path)
    cv.convert(output_path, start=0, end=None)
    cv.close()


def pdf_to_xlsx(input_path: str, output_path: str) -> None:
    import pdfplumber
    import openpyxl

    wb = openpyxl.Workbook()
    wb.remove(wb.active)  # remove default blank sheet

    with pdfplumber.open(input_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            ws = wb.create_sheet(title=f"Page {page_num}")

            # --- Try to extract structured tables first ---
            tables = page.extract_tables()
            if tables:
                row_cursor = 1
                for table in tables:
                    for row in table:
                        for col_idx, cell in enumerate(row, start=1):
                            ws.cell(row=row_cursor, column=col_idx, value=cell or "")
                        row_cursor += 1
                    row_cursor += 1  # blank row between tables
            else:
                # --- Fall back: extract all plain text line-by-line ---
                text = page.extract_text() or ""
                for row_idx, line in enumerate(text.split("\n"), start=1):
                    ws.cell(row=row_idx, column=1, value=line)

    wb.save(output_path)


def pdf_to_pptx(input_path: str, output_path: str) -> None:
    from pdf2image import convert_from_path
    from pptx import Presentation
    from pptx.util import Inches
    import tempfile

    # Render each PDF page as a high-resolution PNG
    images = convert_from_path(input_path, dpi=150)

    prs = Presentation()
    # Use a blank slide layout (index 6 = completely blank)
    blank_layout = prs.slide_layouts[6]

    slide_width = prs.slide_width
    slide_height = prs.slide_height

    with tempfile.TemporaryDirectory() as tmp_dir:
        for idx, image in enumerate(images):
            img_path = os.path.join(tmp_dir, f"page_{idx}.png")
            image.save(img_path, "PNG")

            slide = prs.slides.add_slide(blank_layout)
            slide.shapes.add_picture(img_path, 0, 0, slide_width, slide_height)

    prs.save(output_path)


def main():
    if len(sys.argv) != 4:
        print("Usage: convert_pdf.py <mode> <input_path> <output_path>", file=sys.stderr)
        sys.exit(1)

    mode = sys.argv[1].lower()
    input_path = sys.argv[2]
    output_path = sys.argv[3]

    if not os.path.isfile(input_path):
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    try:
        if mode == "docx":
            pdf_to_docx(input_path, output_path)
        elif mode == "xlsx":
            pdf_to_xlsx(input_path, output_path)
        elif mode == "pptx":
            pdf_to_pptx(input_path, output_path)
        else:
            print(f"Unknown mode: {mode}. Use docx, xlsx, or pptx.", file=sys.stderr)
            sys.exit(1)

        print(f"OK:{output_path}")
    except Exception as exc:
        print(f"ERROR:{exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
