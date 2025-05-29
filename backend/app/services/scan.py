from manga_ocr import MangaOcr
from pathlib import Path
import logging
import base64
import uuid 
import os

logger = logging.getLogger(__name__)


IMG_DIR = Path(__file__).resolve().parent.parent.parent / "img"


def perform_ocr_on_image(base64_data_url: str) -> str:
    """
    Decodes a base64 data URL, saves it as a temporary image file,
    performs OCR on the image file, and then deletes the temporary file.
    """
    temp_image_path = None
    try:
        IMG_DIR.mkdir(parents=True, exist_ok=True)

        try:
            header, base64_str = base64_data_url.split(',', 1)
        except ValueError:
            logger.error("Invalid base64 data URL format.")
            raise ValueError("Invalid base64 data URL format. Expected 'data:[<mediatype>];base64,<data>'")
        
        file_extension = ".png" 
        if 'image/jpeg' in header:
            file_extension = ".jpg"
        elif 'image/webp' in header:
            file_extension = ".webp"

        image_bytes = base64.b64decode(base64_str)

        unique_filename = f"temp_ocr_img_{uuid.uuid4().hex}{file_extension}"
        temp_image_path = IMG_DIR / unique_filename

        with open(temp_image_path, 'wb') as f:
            f.write(image_bytes)
        logger.info(f"Temporary image saved to: {temp_image_path}")

        ocr_tool = MangaOcr() 
        extracted_text = ocr_tool(str(temp_image_path)) 
        logger.info(f"OCR extracted text successfully from {temp_image_path}")
        
        return {"translated_text": extracted_text}

    except Exception as e:
        logger.error(f"Error during OCR processing: {e}")
        raise Exception(f"Failed during OCR operation: {str(e)}")
    finally:
        if temp_image_path and os.path.exists(temp_image_path):
            try:
                os.remove(temp_image_path)
                logger.info(f"Successfully deleted temporary image: {temp_image_path}")
            except OSError as e_remove:
                logger.error(f"Error deleting temporary image {temp_image_path}: {e_remove}")