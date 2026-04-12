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
    file_field.open('rb')
    reader = PdfReader(file_field)
    count = len(reader.pages)
    file_field.close()
    return count


def _estimate_docx_pages(file_field):
    from docx import Document
    file_field.open('rb')
    doc = Document(file_field)
    file_field.close()

    # Estimate: count paragraphs' word totals, ~250 words per page
    word_count = sum(len(p.text.split()) for p in doc.paragraphs)
    estimated_pages = max(1, round(word_count / 250))
    return estimated_pages