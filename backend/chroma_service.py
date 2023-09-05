import re
import uuid

from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from pathlib import Path

class DocumentParser():
    # TAGS_REGX  = r'<\?%\s*.*?%\s*>'
    TAGS_REGX  = r'<\?%\s*(.*?)%\s*>'

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
            chunk_size = 300, # need to research on the right value to use for chunk_size and chunk_overlap
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
    
    @staticmethod
    def extract_tags(text:str):
        """
        Given an excerpt, extract out the selected tags
        """
        matches = re.findall(DocumentParser.TAGS_REGX, text)
        output = []
        if len(matches) > 0:
            for match in matches:
                type, object_id = match.split(",")
                type = type.split("=")[1]
                object_id = object_id.split("=")[1]
                assert len(type) != 0 and len(object_id) != 0, f"Invalid tag format, {type, object_id}!" 
                output.append((type, object_id))
        return output

if __name__ == "__main__":
    text = f"of life's cruelties. <?% type=image,object_id={str(uuid.uuid4())} %> Were they necessary for growth, like the way heat transforms sugar into the sweetest candies? Or were they simply random, like a child's choice of which jelly bean to eat next? <?% type=text,object_id={str(uuid.uuid4())} %> In that moment, as it melted away in the warmth of a child's mouth, Jello found a bitte"
    print(text)
    matches = DocumentParser.extract_tags(text)
    print(matches)