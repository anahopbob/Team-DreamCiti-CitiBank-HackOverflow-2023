from fastapi import FastAPI
from app.routes import chromaDB, s3Bucket, mysqlDB # Import your API route modules
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

# Set up CORS for front end
origins = [
    "http://localhost:3000",
]
# CORS (Cross-Origin Resource Sharing) configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You might want to restrict this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Document Item for POST Enroll

# Initialize chroma db client 

@app.get("/")
async def root():
    return { "message": "Hello world" }


# Dependency injection configuration
app.include_router(chromaDB.router, prefix="", tags=["chromaDB"])
app.include_router(s3Bucket.router, prefix="", tags=["s3Bucket"])
app.include_router(mysqlDB.router, prefix="", tags=["mysqlDB"])

# Custom middleware

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
