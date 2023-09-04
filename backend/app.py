from fastapi import FastAPI

import chromadb
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from langchain.chains.question_answering import load_qa_chain

app = FastAPI()

@app.get("/")
async def root():
    return { "message": "Hello world" }


@app.get("/search/{query}/{file}")
def search(query: str, file: str):
    reader = PdfReader(file)
    raw_text = ""
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            raw_text += text

    text_splitter = CharacterTextSplitter(
        separator = "\n",
        chunk_size = 1500, # need to research on the right value to use for chunk_size and chunk_overlap
        chunk_overlap = 200,
        length_function = len,
    )
    
    texts = text_splitter.split_text(raw_text)
    
    chunk_ids = []
    index = 1
    for text in texts:
        chunk_ids.append(f"id{index}")
        index+=1
    

    chroma_client = chromadb.Client()
    
        
    collection = chroma_client.get_or_create_collection(name="dreamciti")
    collection.add(documents=texts, ids=chunk_ids)

    # Use 5 Chunks of text to do the similarity search
    results = collection.query(
        query_texts=[query],
        n_results=5,
    )

    return results



