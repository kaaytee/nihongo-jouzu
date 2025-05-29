from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

from app.services.scan import perform_ocr_on_image

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/scan")

class ImageData(BaseModel):
    imageData: str 

#  for now it just uses the one in /img
@router.post("/translate")
async def translate_image(img: ImageData):
    if not img.imageData:
        logger.error("Received empty image data.")
        raise HTTPException(status_code=400, detail="No image data received")

    try:
        extracted_text = perform_ocr_on_image(img.imageData)
        return {
            "message": "File processed successfully",
            "translated_text": extracted_text,
        }
    except Exception as e: 
        logger.error(f"Error during OCR processing: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


