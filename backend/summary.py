import os 
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

class SummariseContext():

    @staticmethod
    def summarise_context():
        """Summarise the context."""
        summaries = []
        for text in texts:
            response = openai.Completion.create(
                engine="davinci",
                prompt=text,
                temperature=0.3,
                max_tokens=60,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
                stop=["\n", " id"]
            )
            summaries.append(response.choices[0].text)
        return summaries
    
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

