from fastapi import FastAPI
from app.routers import scan
app = FastAPI()

app.include_router(scan.router)

@app.get("/")
async def root():
    print("Hello World")
    return {"message": "Hello World"} 


