from fastapi import APIRouter, Query, File, UploadFile, HTTPException
from app.embeddings.MiniLM_embedder import MiniLM_embedder
from app.services import chroma_service
from app.models import chromaDocument 
from app.services.summary import SummariseContext
from app.embeddings.imageToText import ImageToText
from app.embeddings.imageEmbedding import ImageEmbedding

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

Image = chromaDocument.Image
# imageToText = imageToText.ImageToText

router = APIRouter()

client = chromadb.PersistentClient(
    path="db/chroma.db"
)   
collection = client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
)
image_collection = client.get_or_create_collection(
    name="images",
    metadata={"hnsw:space": "cosine"}
)

images_collection = client.get_or_create_collection(
    name="all_images",
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

                        # for storing in s3 bucket
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
        
            return {"extracted text": ''.join(extractedText)}
        
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
    # Getting info from POST
    document_dict = document.dict()
    id = document_dict.get("id","")
    text = document_dict.get("text","")
    department = document_dict.get("department","")

    # Parses text here
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
    collection.add(
        embeddings=embeddings,
        documents=texts,
        metadatas=metadata,
        ids=[str(uuid.uuid4()) for x in range(len(texts))] # Generated by us uuid4.uuid()
    )
    # ============Start AI Portion==============

    return None


@router.post("/enrollimage")
def enroll_image(image: Image):
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
    image_collection.add(
        embeddings=embeddings,
        documents=image_text,
        metadatas=metadata,
        ids=[str(uuid.uuid4()) for x in range(len(image_text))] # Generated by us uuid4.uuid()
    )
    # ============Start AI Portion==============

    return None



# @router.post("/enrollimage")
# def enroll_image(image: Image)->None:
#     """
#     Given a particular department and image, get embeddings for the image 
#     and enroll inside the DB.
#     """
#     # Getting info from POST
#     image_dict = image.dict()
#     id = image_dict.get("id","")
#     file = image_dict.get("file","")
#     department = image_dict.get("department","")

#     # get text of the image
    
#     # ============ Start AI Portion==============
#     # Get embeddings
   
#     embeddings = ImageEmbedding.get_image_embeddings(file)

#     # Create metadata list
#     metadata = [
#         {
#             "department": department,
#             "object_id": id,
#             "content_id": idx
#         }
#         for idx, _ in enumerate(range(len(embeddings)))
#     ]


#     images_collection.add(
#         embeddings=embeddings,
#         documents=file,
#         metadatas=metadata,
#         ids=[str(uuid.uuid4()) for x in range(len(embeddings))] # Generated by us uuid4.uuid()
#     )
#     # ============Start AI Portion==============

#     return None


@router.get("/search/")
def search_items(
    department: str = Query(None, description="Department name (optional)"),
    query: str = Query(..., description="Query string"),
):
    # Use 5 Chunks of text to do the similarity search
    results = collection.query(
        query_texts=[query],
        n_results=5,
    )

    # results_arr = [query]
    # results_arr += results['documents'][0]

    # return results_arr

    return results

#search for caption of image 
@router.get("/searchimage/")
def search_images(
    department: str = Query(None, description="Department name (optional)"),
    query: str = Query(..., description="Query string"),
):
    # Use 5 Chunks of text to do the similarity search
    results = image_collection.query(
        query_texts=[query],
        n_results=5,
    )

    return results

#search for similarity of image embeddings 
@router.get("/searchimages/")
def search_images_embedding(
    department: str = Query(None, description="Department name (optional)"),
    query: str = Query(..., description="Query string"),
):
    # Use 5 Chunks of text to do the similarity search
    embeddings = ImageEmbedding.get_image_embeddings(query)
    results = images_collection.query(
        query_embeddings=embeddings,
        n_results=5,
    )

    return results

@router.post("/summarise")
def summarise_items(
    results_arr: List[str]
    ):
    # return results_arr
    summary_output = SummariseContext.summarise_context(results_arr)

    return summary_output

