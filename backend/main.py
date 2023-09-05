from fastapi import FastAPI
from app.routes import chromaDB  # Import your API route modules
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

# Document Item for POST Enroll

# Initialize chroma db client 


@app.get("/")
async def root():
    return { "message": "Hello world" }



# CORS (Cross-Origin Resource Sharing) configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You might want to restrict this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection configuration
app.include_router(chromaDB.router, prefix="", tags=["chromaDB"])

# Initialize database


# Custom middleware


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
