#!/usr/bin/env python3

import sys
import os


# ---------------- PDF → WORD ----------------
def pdf_to_docx(input_path, output_path):
    from pdf2docx import Converter
    cv = Converter(input_path)
    cv.convert(output_path, start=0, end=None)
    cv.close()


# ---------------- PDF → EXCEL ----------------
def pdf_to_xlsx(input_path, output_path):
    import pdfplumber
    import openpyxl

    wb = openpyxl.Workbook()
    wb.remove(wb.active)

    with pdfplumber.open(input_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            ws = wb.create_sheet(title=f"Page {page_num}")

            tables = page.extract_tables()
            if tables:
                row_cursor = 1
                for table in tables:
                    for row in table:
                        for col_idx, cell in enumerate(row, start=1):
                            ws.cell(row=row_cursor, column=col_idx, value=cell or "")
                        row_cursor += 1
                    row_cursor += 1
            else:
                text = page.extract_text() or ""
                for row_idx, line in enumerate(text.split("\n"), start=1):
                    ws.cell(row=row_idx, column=1, value=line)

    wb.save(output_path)


# ---------------- PDF → PPT ----------------
def pdf_to_pptx(input_path, output_path):
    from pdf2image import convert_from_path
    from pptx import Presentation
    import tempfile

    images = convert_from_path(input_path, dpi=150)
    prs = Presentation()
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


# ---------------- 🔐 PROTECT PDF ----------------
def pdf_protect(input_path, output_path, password):
    from PyPDF2 import PdfReader, PdfWriter

    reader = PdfReader(input_path)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(password)

    with open(output_path, "wb") as f:
        writer.write(f)


# ---------------- 🔓 UNLOCK PDF ----------------
def pdf_unlock(input_path, output_path, password):
    from PyPDF2 import PdfReader, PdfWriter

    reader = PdfReader(input_path)

    if reader.is_encrypted:
        result = reader.decrypt(password)
        if result == 0:
            raise Exception("Wrong password")

    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    with open(output_path, "wb") as f:
        writer.write(f)


# ---------------- MAIN ----------------
def main():
    if len(sys.argv) < 4:
        print("Usage: convert_pdf.py <mode> <input> <output> [password]", file=sys.stderr)
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

        elif mode == "protect":
            if len(sys.argv) != 5:
                print("Password required", file=sys.stderr)
                sys.exit(1)
            password = sys.argv[4]
            pdf_protect(input_path, output_path, password)

        elif mode == "unlock":
            if len(sys.argv) != 5:
                print("Password required", file=sys.stderr)
                sys.exit(1)
            password = sys.argv[4]
            pdf_unlock(input_path, output_path, password)

        else:
            print(f"Unknown mode: {mode}", file=sys.stderr)
            sys.exit(1)

        print(f"OK:{output_path}")

    except Exception as e:
        print(f"ERROR:{str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()