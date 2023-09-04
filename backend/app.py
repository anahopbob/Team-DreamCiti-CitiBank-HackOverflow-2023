from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

from chroma_service import DocumentParser
from embeddings.MiniLM_embedder import MiniLM_embedder

import chromadb
from chromadb.utils import embedding_functions

from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from langchain.chains.question_answering import load_qa_chain

# Initialize FastAPI
app = FastAPI()

# Initialize chroma db client 
client = chromadb.PersistentClient(
                                path="db/chroma.db"
                                )   

# Document Item
class Document(BaseModel):
    id:str #From s3 bucket
    text:str
    department:str


@app.get("/")
async def root():
    return { "message": "Hello world" }

@app.post("/enroll")
def enroll(document: Document):
    """
    Given a particular department and text, get embeddings for the text 
    and enroll inside the DB.
    """
    document_dict = document.dict()
    id = document_dict.get("id","")
    text = document_dict.get("text","")
    department = document_dict.get("department","")

    texts, chunk_ids = DocumentParser.split_texts(text)
    print(f"Length of texts is {len(text)}")

    # Get embeddings
    custom_embeddings = MiniLM_embedder()
    embeddings = custom_embeddings(texts)
    print(len(embeddings), len(texts), embeddings[0].shape)
    return None


# @app.get("/search/{query}/{file}")
# def search(query: str, file: str):
#     reader = PdfReader(file)
#     raw_text = ""
#     for i, page in enumerate(reader.pages):
#         text = page.extract_text()
#         if text:
#             raw_text += text

#     text_splitter = CharacterTextSplitter(
#         separator = "\n",
#         chunk_size = 1500, # need to research on the right value to use for chunk_size and chunk_overlap
#         chunk_overlap = 200,
#         length_function = len,
#     )
    
#     texts = text_splitter.split_text(raw_text)
    
#     chunk_ids = []
#     index = 1
#     for text in texts:
#         chunk_ids.append(f"id{index}")
#         index+=1
    
    
        
#     collection = chroma_client.get_or_create_collection(name="dreamciti")
#     collection.add(documents=texts, ids=chunk_ids)

#     # Use 5 Chunks of text to do the similarity search
#     results = collection.query(
#         query_texts=[query],
#         n_results=5,
#     )

#     return results



