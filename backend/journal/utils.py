import os

def extract_page_count(file_field):
    """
    Given a Django FileField, return the page count as a string.
    Returns None if extraction fails or format is unsupported.
    """
    if not file_field:
        return None

    name = file_field.name.lower()

    try:
        if name.endswith('.pdf'):
            return _count_pdf_pages(file_field)
        elif name.endswith('.docx'):
            return _estimate_docx_pages(file_field)
        elif name.endswith('.doc'):
            # .doc (old binary format) — can't read without LibreOffice
            return None
    except Exception:
        return None

    return None


def _count_pdf_pages(file_field):
    from pypdf import PdfReader
    # Read from path on disk, not from the file object
    reader = PdfReader(file_field.path)
    return len(reader.pages)

def _estimate_docx_pages(file_field):
    from docx import Document
    doc = Document(file_field.path)
    word_count = sum(len(p.text.split()) for p in doc.paragraphs)
    return max(1, round(word_count / 250))