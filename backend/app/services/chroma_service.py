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
    def parse_raw_texts(raw_texts:str):
        """
        Accepts the entire text in string format with <%? %> tags included
        and parses it.
        """
        output_text = []
        output_object_ids = []

        # Split the text into chunks
        texts = DocumentParser.split_texts(raw_texts)
        for text in texts:
            # Extract tags
            tags = DocumentParser.extract_tags(text)
            if len(tags) == 0:
                output_text.append(text)
                output_object_ids.append("")
            else:
                # Replace tags with empty string
                text = re.sub(DocumentParser.TAGS_REGX, "", text)
                output_text.append(text)

                # Combine tags to be a string 
                # ChromaDB metadata does not accept list
                tag_string = ""
                for tag in tags:
                    tag_string += f"{tag[1].strip()},"
                tag_string = tag_string[:-1]
                output_object_ids.append(tag_string)
        return output_text, output_object_ids


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
     
        return texts
    
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
    text = f"of life's cruelties. <?% type=image,object_id={str(uuid.uuid4())[:-6]} %> <?% type=image,object_id={str(uuid.uuid4())[:-6]} %> Were they necessary for growth, like the way heat transforms sugar into the sweetest candies? Or were they simply random, like a child's choice of which jelly bean to eat next? <?% type=text,object_id={str(uuid.uuid4())[:-6]} %> In that moment, as it melted away in the warmth of a child's mouth, Jello found a bitte"
    texts, ids = DocumentParser.parse_raw_texts(text)
    print(texts)
    print(ids)