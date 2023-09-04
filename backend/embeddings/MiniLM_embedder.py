from Embedder_ABC import Embedder_ABC
from sentence_transformers import SentenceTransformer

class MiniLM_embedder(Embedder_ABC):
    def __init__(self):
        """
        Initialize the models.
        """
        self.model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')

    def get_embeddings(self, text:str):
        return self.model.encode(text)
    
if __name__ == "__main__":
    # Initialize the embedder
    embedder = MiniLM_embedder()

    # Get the embeddings
    embeddings = embedder.get_embeddings("This is a test sentence.")

    # Print the embeddings
    print(embeddings)