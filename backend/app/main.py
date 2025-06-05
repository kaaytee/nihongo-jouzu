import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scan
from app.routers import search as search_router

app = FastAPI()

load_dotenv()


origins = [
    "http://localhost:1212",
    "http://localhost:5173",
    os.environ.get("FRONTEND_URL", ""), 
]

origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router, prefix="/api", tags=["scan"])
app.include_router(search_router.router, prefix="/api", tags=["search"])

@app.get("/")
async def root():
    print("Hello World")
    return {"message": "Hello World"} 


