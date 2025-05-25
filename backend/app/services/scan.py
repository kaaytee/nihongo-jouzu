from manga_ocr import MangaOcr
from pathlib import Path


def perform_ocr_on_image(image_filename: str = "1.png") -> str:
    """
    Performs OCR on the specified image file 
    """
    ocr_tool = MangaOcr() 
    backend_dir_path = Path.cwd()
    image_path = backend_dir_path / "img" / image_filename
    
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
        
    extracted_text = ocr_tool(str(image_path))
    return extracted_text
