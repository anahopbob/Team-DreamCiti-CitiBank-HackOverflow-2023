import re
import uuid
from typing import List

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
    
    @staticmethod
    def check_broken_tags(text:str, tag_max_length:int=50) -> List[bool]:
        """
        Given a text, scans to see if there are broken text.
        Looks out for <%? and %>
        If we are using UUID, the expected length of the text will be 36 character. 

        Returns:
            [bool,bool]: True indicates the tag is broken, False indicates the tag is unbroken,
                        First element refers to start, second element refers to end.
        """
        
        output = [False, False]

        text_start = text[:tag_max_length]
        text_end = text[-tag_max_length:]

        first_index = text_start.find(">")
        if first_index != -1:
            # Means there might be broken tag at the start
            if first_index - 1 >= 0 and text_start[first_index-1] == "%": # %>
                if text_start.find("<?%") != -1:
                    # This means the tag is complete
                    output[0] = False
                else:
                    output[0] = True
        
        # Find all occurences of "<" in end
        last_index = text_end.rfind("<")
        if last_index != -1:
            # Means there might be broken tag at the end
            # Find index of "<"
            # Check if the next character is "%?"
            if last_index + 1 < len(text_end) and text_end[last_index+1] == "?": # <? 
                if last_index + 2 < len(text_end) and text_end[last_index+2] == "%": # <?%
                    # Check if from the last_index to the end, is there a "%>"
                    if "%>" in text_end[last_index:]:
                        # This means the tag is unbroken
                        output[1] = False
                    else:
                        output[1] = True
                
        return output

if __name__ == "__main__":
    # text = f"of life's cruelties. <?% type=image,object_id={str(uuid.uuid4())[:-6]} %> <?% type=image,object_id={str(uuid.uuid4())[:-6]} %> Were they necessary for growth, like the way heat transforms sugar into the sweetest candies? Or were they simply random, like a child's choice of which jelly bean to eat next? <?% type=text,object_id={str(uuid.uuid4())[:-6]} %> In that moment, as it melted away in the warmth of a child's mouth, Jello found a bitte"
    # texts, ids = DocumentParser.parse_raw_texts(text)
    # print(texts)
    # print(ids)

    text1 = "This is a sample text without a broken tag: <?% type=broken,object_id=123 %>. Lorem ipsum dolor sit amet."
    text2 = "<<<<?% type=extra<,object_id=456 %>>. Nulla < >euismod massa vel lectus."
    text3 = "This is a sample text with a broken tag: <?% type=broken,object_id=123"
    text4 = "ect_id=123 %>This is a sample text with a broken tag:<?% type=broken,object_id=123"

    assert DocumentParser.check_broken_tags(text1) == [False, False], f"Expected [False, False], got {DocumentParser.check_broken_tags(text1)}!"
    assert DocumentParser.check_broken_tags(text2) == [False, False], f"Expected [False, False], got {DocumentParser.check_broken_tags(text2)}!"
    assert DocumentParser.check_broken_tags(text3) == [False, True], f"Expected [False, True], got {DocumentParser.check_broken_tags(text3)}!"
    assert DocumentParser.check_broken_tags(text4) == [True, True], f"Expected [True, True], got {DocumentParser.check_broken_tags(text4)}!"
    