import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scan
app = FastAPI()

load_dotenv()

# Define the allowed origin from an environment variable, with a default
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:1212")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Use the environment variable
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(scan.router)

@app.get("/")
async def root():
    print("Hello World")
    return {"message": "Hello World"} 


