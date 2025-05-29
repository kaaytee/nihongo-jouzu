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
@router.get("/translate")
async def translate_image():
    try:
        # You might want to make the image name dynamic, e.g., from a query parameter
        extracted_text = perform_ocr_on_image("1.png") 
        return {
            "message": "File processed successfully",
            "translated_text": extracted_text,
        }
    except FileNotFoundError as e:
        return {"error": str(e), "message": "Failed to process image."}
    except Exception as e:
        # Log the exception e
        return {"error": "An unexpected error occurred.", "message": "Failed to process image."}
    

# New endpoint to receive image data from frontend
@router.post("/receive-image")
async def receive_image_data(image_payload: ImageData):
    """
    Receives image data from the frontend.
    For now, just logs a confirmation.
    """
    if not image_payload.imageData:
        logger.error("Received empty image data.")
        raise HTTPException(status_code=400, detail="No image data received")

    image_data_preview = image_payload.imageData[:100] + "..." if len(image_payload.imageData) > 100 else image_payload.imageData
    logger.info(f"Received image data from frontend. Preview: {image_data_preview}")
    print(f"Backend: Received image data successfully! Preview: {image_data_preview}") # For simple terminal output

    return {"message": "Image received successfully by backend", "status": "ok"}

