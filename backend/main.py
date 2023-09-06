from fastapi import FastAPI, UploadFile, File
from typing import List
from app.routes import chromaDB  # Import your API route modules
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os
from dotenv import load_dotenv

load_dotenv()  # This loads the values from .env into the environment

ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
ACCESS_SECRET_KEY = os.getenv("ACCESS_SECRET_KEY")


# Initialize FastAPI
app = FastAPI()

#initialize S3 client
s3 = boto3.client('s3',
                    aws_access_key_id = ACCESS_KEY_ID,
                    aws_secret_access_key = ACCESS_SECRET_KEY
                     )

BUCKET_NAME='dreamciti'

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

#S3 Bucket API's
@app.get("/getallfiles")
async def hello():
    
    res = s3.list_objects_v2(Bucket=BUCKET_NAME)
    print(res)
    return res

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if file:
        print(file.filename)
        s3.upload_fileobj(file.file, BUCKET_NAME, file.filename)
        return "file uploaded"
    else:
        return "error in uploading."




# Dependency injection configuration
app.include_router(chromaDB.router, prefix="", tags=["chromaDB"])

# Initialize database


# Custom middleware


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
