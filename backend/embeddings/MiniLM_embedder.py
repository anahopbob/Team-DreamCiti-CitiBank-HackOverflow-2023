from chromadb import Documents, EmbeddingFunction
from sentence_transformers import SentenceTransformer

class MiniLM_embedder(EmbeddingFunction):
    """
    ChromaDB currently uses this model by default.
    Leaving this in here in the future so we can swap out embeddings quicker.
    """
    def __init__(self):
        """
        Initialize the models.
        """
        self.model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')

    def __call__(self, texts: Documents):
        embeddings = []
        for text in texts:
            embs = self.model.encode(text)
            embeddings.append(embs)
        return embeddings
    
# if __name__ == "__main__":
#     # Initialize the embedder
#     embedder = MiniLM_embedder()

#     # Get the embeddings
#     embeddings = embedder.get_embeddings("This is a test sentence.")

#     # Print the embeddings
#     print(embeddings)