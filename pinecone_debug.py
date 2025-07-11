"""
Debug Pinecone connection, embedding, and query outside Django.
Run: python pinecone_debug.py
"""
import os
from dotenv import load_dotenv
import pinecone
from huggingface_hub import InferenceClient

load_dotenv()
# --- Config ---
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_HOST = os.getenv('PINECONE_HOST')
PINECONE_INDEX = os.getenv('PINECONE_INDEX', 'codegen-demo')
HF_API_TOKEN = os.getenv('HF_API_TOKEN')

# --- Embedding ---
def embed_text(text):
    """
    Use the 768-dim 'sentence-transformers/all-mpnet-base-v2' model for Pinecone index compatibility.
    Always return a plain list for Pinecone.
    """
    model = "sentence-transformers/all-mpnet-base-v2"
    client = InferenceClient(token=HF_API_TOKEN)
    embedding = client.feature_extraction(text, model=model)
    emb = embedding[0] if isinstance(embedding, list) and len(embedding) > 0 else embedding
    if hasattr(emb, 'tolist'):
        emb = emb.tolist()
    return emb

# --- Pinecone ---
def debug_pinecone():
    print("Connecting to Pinecone...")
    pc = pinecone.Pinecone(api_key=PINECONE_API_KEY)
    indexes = [idx['name'] for idx in pc.list_indexes()]
    print(f"[Pinecone] Available indexes: {indexes}")
    if PINECONE_INDEX not in indexes:
        print(f"Index '{PINECONE_INDEX}' does not exist!")
        return
    index = pc.Index(PINECONE_INDEX)
    print(f"[Pinecone] Using index: {index}")
    try:
        stats = index.describe_index_stats()
        print(f"[Pinecone] Index stats: {stats}")
    except Exception as e:
        print(f"[Pinecone] Could not get index stats: {e}")
        return
    # Test query with dummy embedding
    test_text = "def hello():\n    print('hello world')"
    emb = embed_text(test_text)
    print(f"[Embedding] Type: {type(emb)}, Dim: {len(emb) if hasattr(emb, '__len__') else 'unknown'}")
    # Print first 5 values for sanity check
    print(f"[Embedding] First 5 values: {emb[:5] if hasattr(emb, '__getitem__') else emb}")
    try:
        res = index.query(vector=emb, top_k=3, include_metadata=True, namespace="")
        print(f"[Pinecone] Query result: {res}")
    except Exception as e:
        print(f"[Pinecone] Query error: {e}")

if __name__ == "__main__":
    debug_pinecone()
