import os
import shutil
import subprocess
from pathlib import Path
from django.conf import settings
from django.core.files import File

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


def convert_manuscript_to_published_pdf(submission, article):
    """
    Converts submission manuscript to a published PDF and assigns it
    to article.published_pdf. Handles .pdf, .docx files.
    Returns True on success, False on failure.
    """
    if not submission.manuscript_file:
        return False

    src_path = Path(submission.manuscript_file.path)
    published_dir = Path(settings.MEDIA_ROOT) / 'published'
    published_dir.mkdir(parents=True, exist_ok=True)

    # Build destination filename from article slug
    dest_filename = f"{article.slug}.pdf"
    dest_path = published_dir / dest_filename

    try:
        ext = src_path.suffix.lower()

        if ext == '.pdf':
            # Already a PDF — just copy to published folder
            shutil.copy2(src_path, dest_path)

        elif ext in ('.docx', '.doc'):
            # Convert using LibreOffice headless
            success = _convert_with_libreoffice(src_path, published_dir)
            if not success:
                return False
            # LibreOffice saves with same stem but .pdf extension
            lo_output = published_dir / (src_path.stem + '.pdf')
            if lo_output.exists():
                lo_output.rename(dest_path)
            else:
                return False
        else:
            return False

        # Assign the converted file to article.published_pdf
        with open(dest_path, 'rb') as f:
            article.published_pdf.save(dest_filename, File(f), save=False)

        return True

    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"PDF conversion failed for submission {submission.id}: {e}")
        return False


def _convert_with_libreoffice(src_path, output_dir):
    """
    Uses LibreOffice in headless mode to convert a file to PDF.
    """
    # Common LibreOffice paths on Windows
    lo_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        "soffice",  # if it's on PATH
    ]

    lo_executable = None
    for path in lo_paths:
        if os.path.exists(path) or shutil.which(path):
            lo_executable = path
            break

    if not lo_executable:
        import logging
        logging.getLogger(__name__).error(
            "LibreOffice not found. Install from https://libreoffice.org "
            "to enable DOCX→PDF conversion."
        )
        return False

    try:
        result = subprocess.run(
            [
                lo_executable,
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', str(output_dir),
                str(src_path),
            ],
            timeout=60,
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        return False
    except Exception:
        return False