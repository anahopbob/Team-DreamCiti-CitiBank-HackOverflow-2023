from fastapi import APIRouter, Query
from app.embeddings.MiniLM_embedder import MiniLM_embedder
from app.services import chroma_service
from app.models import chromaDocument 
from app.services.summary import SummariseContext

import chromadb
import uuid
from typing import List

from chromadb.utils import embedding_functions
from PyPDF2 import PdfReader
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

@router.post("/summarise")
def summarise_items(
    results_arr: dict
    ) -> str:
    summary_output = SummariseContext.summarise_context(results_arr["results_arr"])

    return summary_output
