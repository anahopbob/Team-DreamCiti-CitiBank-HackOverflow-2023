import os 
import openai
from typing import List
from dotenv import load_dotenv

load_dotenv()


class SummariseContext():

    @staticmethod
    def summarise_context(results_dict: dict):
        query = results_dict["query"]
        context = results_dict["results"]["documents"][0]
        openai.api_key = os.getenv("OPENAI_API_KEY")
        """Summarise the context."""
        combined_text = ("\n").join(context)
        content = f"You are an AI assistant for searching and understanding of documents and context using the query {query} and the following context {combined_text}."
        messages = [{"role": "system", "content": content}]
        response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-16k",
                messages=messages,
                temperature=0.7,
                max_tokens=800,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
                stop=None)
        return response.choices[0].message['content']
    