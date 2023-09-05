from fastapi import APIRouter, Query, File, UploadFile, HTTPException
from app.embeddings.MiniLM_embedder import MiniLM_embedder
from app.services import chroma_service
from app.models import chromaDocument 
from app.services.summary import SummariseContext

from fastapi.responses import JSONResponse

import chromadb
import uuid
import fitz
import PIL.Image
import io
import os
import tabula
import pandas as pd

from typing import List

from chromadb.utils import embedding_functions
from PyPDF2 import PdfReader
from pdfminer.high_level import extract_text, extract_pages

from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from langchain.chains.question_answering import load_qa_chain

Document = chromaDocument.Document
DocumentParser = chroma_service.DocumentParser

router = APIRouter()

client = chromadb.PersistentClient(
    path="db/chroma.db"
)   
collection = client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
)

@router.post("/pdf-enroll")
async def pdf_enroll(file: UploadFile):
    """
    Given a file (PDF/Word) upload, extract its text and images. 
    The file and its images will be stored in the AWS S3 bucket and 
    together with the reformatted text, it will then be enrolled into the Vector DB.
    """
    # Extracting file properties
    fileName = file.filename
    fileExtension = file.filename.split(".")[-1].lower()

    # Determining file type
    if fileExtension == "pdf":
        try:
            # extract text from pdf
            pdfContent = await file.read()
            text = extract_text(io.BytesIO(pdfContent))
        
            # extract images from pdf
            # Create a PDF document object using PyMuPDF (Fitz)
            pdf_document = fitz.open(stream=pdfContent, filetype="pdf")

            # Directory to save extracted images
            images_dir = "images"
            os.makedirs(images_dir, exist_ok=True)

            # Initialize a counter for images
            counter = 0

            # Iterate through each page of the PDF
            for page_number in range(len(pdf_document)):
                page = pdf_document.load_page(page_number)
                
                # Extract images from the page
                images = page.get_images(full=True)
                
                for idx, image in enumerate(images):
                    xref = image[0]
                    base_img = pdf_document.extract_image(xref)
                    image_data = base_img["image"]
                    extension = base_img["ext"]
                    image_filename = os.path.join(images_dir, f"image_{counter}.{extension}")

                    # currently saves to images folder in backend root directory (to be changed once s3 set up)
                    with open(image_filename, "wb") as image_file:
                        image_file.write(image_data)

                    counter += 1
            
            # Close the PDF document
            pdf_document.close()
        
            return {"extracted text": text, "image count": counter}
        
        except Exception as e:
            return {"error": str(e)}
        
    else:
        raise HTTPException(status_code=400, detail="Uploaded file is not a PDF")
    

@router.post("/enroll")
def enroll(document: Document)->None:
    """
    Given a particular department and text, get embeddings for the text 
    and enroll inside the DB.
    """
    try:
        # Getting info from POST
        document_dict = document.dict()
        id = document_dict.get("id","")
        text = document_dict.get("text","")
        department = document_dict.get("department","")

        # Parses text here, fixes the tags
        texts, content_ids = DocumentParser.parse_raw_texts(text)

        # ============ Start AI Portion==============
        # Get embeddings
        custom_embeddings = MiniLM_embedder()
        embeddings = custom_embeddings(texts)

        # Function to get content_id (replace with your actual logic)

        # Create metadata list, add in object_id and department
        metadata = [
            {
                "department": department,
                "object_id": id,
                "content_id": content_ids[idx]
            }
            for idx, _ in enumerate(range(len(texts)))
        ]
        
        # Generating unique IDs for each document
        excerpt_ids = [str(uuid.uuid4()) for x in range(len(texts))]

        # Associating the object_id with the excerpt_id (using a NoSQL way)
        id_pairing = {
            id : excerpt_ids 
        }
        print(f"This is the pairing that should be saved: {id_pairing}")

        # Added into vectordb
        collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadata,
            ids=excerpt_ids # Generated by us uuid4.uuid()
        )
        # ============Start AI Portion==============
        return JSONResponse(content={"message": "Successfully enrolled"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)


@router.get("/search/")
def search_items(
    department: str = Query(None, description="Department name (optional)"),
    query: str = Query(..., description="Query string"),
):
    # Use 5 Chunks of text to do the similarity search
    if department == None:
        results = collection.query(
            query_texts=[query],
            n_results=5,
        )
    else:
        results = collection.query(
            query_texts=[query],
            n_results=5,
            where={"department": department}
        )

    if len(results) == 0:
        return JSONResponse(content={"message": "No results found"}, status_code=200)
    else:
        return JSONResponse(content={"results": results}, status_code=200)

@router.post("/summarise")
def summarise_items(
    results_arr: dict
    ) -> str:
    try:
        summary_output = SummariseContext.summarise_context(results_arr["results_arr"])
        return JSONResponse(content={"summary": summary_output}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)
    
@router.post("/delete")
def delete_object(
        object_id: str,
        association: List[str] = None
    ):
    """
    Given an object_id that corrosponds to the one inside S3,
    delete all related embeddings inside ChromaDB.
    Currently, association is hard coded.
    """
    # Connect to  bucket to get association list 
    if len(association) == 0:
        return JSONResponse(content={"message": f"Object {object_id} is not associated with anything!"}, status_code=200)
    try:
        collection.delete(
            ids=association
        )
        return JSONResponse(content={"message": f"{len(association)} embeddings associated with {object_id} have been deleted!"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": "Internal Server Error"}, status_code=500)

# =============== Image Related Endpoints =================

