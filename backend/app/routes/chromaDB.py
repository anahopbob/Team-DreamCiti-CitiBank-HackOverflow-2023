from fastapi import APIRouter, Query, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from app.embeddings.MiniLM_embedder import MiniLM_embedder
from app.services import chroma_service
from app.models import chromaDocument 
from app.services.summary import SummariseContext
from app.embeddings.imageToText import ImageToText
from app.embeddings.imageEmbedding import ImageEmbedding
from app.services.webscrape import WebScrape

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

import urllib.request

Document = chromaDocument.Document
DocumentParser = chroma_service.DocumentParser

ImageDict = chromaDocument.Image
# imageToText = imageToText.ImageToText

router = APIRouter()

client = chromadb.PersistentClient(
    path="db/chroma.db"
)   
collection = client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
)

imagetotext_collection = client.get_or_create_collection(
    name="imagetotext",
    metadata={"hnsw:space": "cosine"}
)

imagesembedding_collection = client.get_or_create_collection(
    name="imageembedding",
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
            # read pdf file
            pdfContent = await file.read()
        
            # Create a PDF document object using PyMuPDF (Fitz)
            pdf_document = fitz.open(stream=pdfContent, filetype="pdf")

            # Directory to save extracted images
            images_dir = "images"
            os.makedirs(images_dir, exist_ok=True)

            # Initialize a variable to store all the extracted text, with delimiter for separate pages and images
            extractedText = [] 

            # Iterate through each page of the PDF
            for page_number in range(len(pdf_document)):
                page = pdf_document.load_page(page_number)

                # Extract text from the page
                pageText = page.get_text()

                # Check if the page contains images and extract all images (using OCR to detect images)
                images = page.get_images(full=True)

                # If page contains images, add a unique image indicator to the extracted text for that particular page only
                if images:
                    for idx, image in enumerate(images):
                        xref = image[0]
                        base_img = pdf_document.extract_image(xref)
                        image_data = base_img["image"]
                        extension = base_img["ext"]

                        # renaming the image file accordingly with a unique id for text extractation formatting
                        uniqueId = str(uuid.uuid4())[:]
                        image_id = f"<?% type=image,object_id={uniqueId} %>"

                        # (to be linked with s3)
                        # image_name = f"type=image,object_id={uniqueId}.{extension}"

                        # currently saves to images folder in backend root directory (to be changed to s3 bucket)
                        # with open(test_image_id, "wb") as image_file:
                        #     image_file.write(image_data)

                        # Add image indicator to the extracted text
                        pageText = image_id + pageText + image_id
                
                # Add the extracted text to the overall extracted text
                extractedText.append(pageText)
                
            # Close the PDF document after iteration completed
            pdf_document.close()
            
            # Invoke AI PDF Enrollment function here (ID to be retrieved from s3, department to be retrieved from frontend)
            sampleId = "12345"
            sampleDepartment = "HumanResources"
            finalText = ''.join(extractedText)

            # print("sampleId: ", sampleId)
            # print("sampleDepartment: ", sampleDepartment)
            # print("finalText: ", finalText)

            finalDocument = {
                "id": sampleId,
                "text": finalText,
                "department": sampleDepartment
            }

            # Determining success of enrollment based on status code
            response = enroll(finalDocument)
            if response.status_code == 200:
                return {"message": "Successfully uploaded PDF"}
            else:
                return {"message": "Error in uploading PDF"}
        
        # catching and returning any errors
        except Exception as e:
            return {"error": str(e)}
    
    # raising HTTP exception if file is not a PDF
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
        id = document.get("id","")
        text = document.get("text","")
        department = document.get("department","")

        # Parses text here, fixes the tags
        texts, content_ids = DocumentParser.parse_raw_texts(text)

        # ============ Start AI Portion==============
        # Get embeddings
        custom_embeddings = MiniLM_embedder()
        embeddings = custom_embeddings(texts)

        # Function to get content_id (replace with your actual logic)

        # Create metadata list
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
        print(f"This is the pairing that should be saved: {id_pairing}, pass ID and list")

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





@router.post("/enroll-image-caption")
def enroll_image_caption(image: ImageDict):
    """
    Given a particular department and image, get embeddings for the image 
    and enroll inside the DB.
    """
    # Getting info from POST
    image_dict = image.dict()
    id = image_dict.get("id","")
    file = image_dict.get("file","")
    department = image_dict.get("department","")

    # get text of the image
    image_obj = ImageToText()
    if file.startswith('http'):
        file = urllib.request.urlopen(file)
  
    image_text = image_obj.getImageToText(file)

    return image_text
    # ============ Start AI Portion==============
    # Get embeddings
    custom_embeddings = MiniLM_embedder()
    embeddings = custom_embeddings(image_text)

    # Function to get content_id (replace with your actual logic)

    # Create metadata list
    metadata = [
        {
            "department": department,
            "object_id": id,
            "content_id": idx
        }
        for idx, _ in enumerate(range(len(image_text)))
    ]
    imagetotext_collection.add(
        embeddings=embeddings,
        documents=image_text,
        metadatas=metadata,
        ids=[str(uuid.uuid4()) for x in range(len(image_text))] # Generated by us uuid4.uuid()
    )
    # ============Start AI Portion==============

    return None



@router.post("/enroll-image-embedding")
def enroll_image_embedding(image: ImageDict)->None:
    """
    Given a particular department and image, get embeddings for the image 
    and enroll inside the DB.
    """
    # Getting info from POST
    image_dict = image.dict()
    id = image_dict.get("id","")
    file = image_dict.get("file","")
    department = image_dict.get("department","")

    # get text of the image
    
    # ============ Start AI Portion==============
    # Get embeddings
   
    embeddings = ImageEmbedding.get_image_embeddings(file)

    # Create metadata list
    metadata = [
        {
            "department": department,
            "object_id": id,
            "content_id": idx
        }
        for idx, _ in enumerate(range(len(embeddings)))
    ]


    imagesembedding_collection.add(
        embeddings=embeddings,
        documents=file,
        metadatas=metadata,
        ids=[str(uuid.uuid4()) for x in range(len(embeddings))] # Generated by us uuid4.uuid()
    )
    # ============Start AI Portion==============

    return None


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
    
# @router.post("/delete")
def delete_object_from_chromadb(
        object_excerpt_list: List[dict]
    ):
    """
    THIS ROUTE HAS BEEN REFACTORED TO BE USED IN mysqlDB.py.
    IT WILL NOT BE CALLED FROM THE ROUTER ABOVE.
    Given an object_id that corrosponds to the one inside S3,
    delete all related embeddings inside ChromaDB.
    Currently, association is hard coded.
    """
    # Connect to  bucket to get association list 
    if len(object_excerpt_list) == 0:
        return []
    try:
        association = []
        for pair in object_excerpt_list:
            association.append(pair["excerpt_id"])
        collection.delete(
            ids=association
        )
        return len(association)
    except Exception as e:
        return None

# =============== Image Related Endpoints =================


@router.get("/webscrape")
def get_webscrape(website: str = Query(None, description="Website to scrape")):
    results = WebScrape.getWebScrape(website)
    # document = Document(id=website, text=results, department="test")
    # enroll(document)
    return results