from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from pathlib import Path

class DocumentParser():

    @staticmethod
    def parse_pdf(file:Path):
        """Parse the PDF file and return the text content."""
        reader = PdfReader(file)
        raw_text = ""
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                raw_text += text
        return raw_text
    
    @staticmethod
    def split_texts(raw_text: str):
        """Split the text into chunks of text."""
        text_splitter = CharacterTextSplitter(
            separator = "",
            chunk_size = 1000, # need to research on the right value to use for chunk_size and chunk_overlap
            chunk_overlap = 50,
            length_function = len,
        )
        
        texts = text_splitter.split_text(raw_text)
        
        chunk_ids = []
        index = 1
        for text in texts:
            chunk_ids.append(f"id{index}")
            index+=1
        
        return texts, chunk_ids

