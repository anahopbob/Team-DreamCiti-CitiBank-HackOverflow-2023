from fastapi import FastAPI, HTTPException, Request, Query
from pydantic import BaseModel

from chroma_service import DocumentParser
from embeddings.MiniLM_embedder import MiniLM_embedder

import chromadb
import uuid
from chromadb.utils import embedding_functions

from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from langchain.chains.question_answering import load_qa_chain

# Initialize FastAPI
app = FastAPI()

# Document Item for POST Enroll
class Document(BaseModel):
    id:str #From s3 bucket
    text:str
    department:str

# Initialize chroma db client 
client = chromadb.PersistentClient(
                                path="db/chroma.db"
                                )   
collection = client.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
) 

@app.get("/")
async def root():
    return { "message": "Hello world" }

# Ideally this will take in the file
# Right now, it takes in a str only



@app.post("/enroll") 
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
    texts, chunk_ids = DocumentParser.split_texts(text)

    # ============ Start AI Portion==============
    # Get embeddings
    custom_embeddings = MiniLM_embedder()
    embeddings = custom_embeddings(texts)

    # Set metadata
    metadata = [{"department": department, 
                 "object_id": id,
                  "images" : [] } # Include image IDs
                 for i in range(len(texts))]
    
    collection.add(
        embeddings=embeddings,
        documents=texts,
        metadatas=metadata,
        ids=[str(uuid.uuid4()) for x in range(len(texts))] # Generated by us uuid4.uuid()
    )
    # ============Start AI Portion==============

    return None

@app.get("/search/")
def search_items(
    department: str = Query(None, description="Department name (optional)"),
    query: str = Query(..., description="Query string"),
):
    # Use 5 Chunks of text to do the similarity search
    results = collection.query(
        query_texts=[query],
        n_results=5,
    )

    return results




