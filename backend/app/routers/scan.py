from fastapi import APIRouter
from app.services.scan import perform_ocr_on_image

router = APIRouter(prefix="/scan")
 
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
    

