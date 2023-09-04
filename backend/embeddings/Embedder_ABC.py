from abc import ABC, abstractmethod

class Embedder_ABC(ABC):
    @abstractmethod
    def __init__(self):
        """
        Initialize the models.
        """
        

    @abstractmethod
    def get_embeddings(self, text:str):
        """
        Given a text, return the embeddings of the text.
        """
        pass