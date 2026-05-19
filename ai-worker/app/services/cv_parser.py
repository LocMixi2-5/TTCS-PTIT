# ═══════════════════════════════════════════════════
# CV Parser Service — Extract text from PDF files
#
# Uses PyPDF2 to extract text from uploaded PDF CVs.
# Handles encoding issues and multi-page documents.
# ═══════════════════════════════════════════════════
import PyPDF2
import io
from fastapi import UploadFile


async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extract text content from an uploaded PDF file.
    
    Args:
        file: FastAPI UploadFile (PDF)
        
    Returns:
        Concatenated text from all pages
        
    Raises:
        ValueError: If file cannot be read or is empty
    """
    try:
        # Read file content into memory
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))

        text_parts = []
        for page_num, page in enumerate(pdf_reader.pages):
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted.strip())

        full_text = " ".join(text_parts)

        if not full_text or len(full_text.strip()) < 10:
            raise ValueError(
                "Could not extract meaningful text from PDF. "
                "The file may be scanned/image-based. "
                "Please use a text-based PDF or enter text manually."
            )

        return full_text

    except PyPDF2.errors.PdfReadError:
        raise ValueError("Invalid or corrupted PDF file. Please upload a valid PDF.")
    except Exception as e:
        if "meaningful text" in str(e) or "Invalid" in str(e):
            raise
        raise ValueError(f"Error reading PDF: {str(e)}")
