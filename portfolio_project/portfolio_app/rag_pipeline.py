# portfolio_project/portfolio_app/rag_pipeline.py
"""
RAG pipeline logic for code generation assistant.
Handles embedding, Pinecone retrieval, prompt augmentation, and LLM inference.
"""
import requests
from django.conf import settings
import logging

# You may need to install pinecone-client and huggingface_hub if not already present
import pinecone
from huggingface_hub import InferenceClient
from transformers import AutoTokenizer

pinecone_api_key = settings.PINECONE_API_KEY
pinecone_host = settings.PINECONE_HOST
pinecone_index_name = getattr(settings, 'PINECONE_INDEX', 'codegen-demo')  # Default index name if not set

# Initialize Pinecone client (singleton pattern)
_pinecone_initialized = False
_index = None

def get_pinecone_index():
    global _pinecone_initialized, _index
    if not _pinecone_initialized:
        pinecone.init(api_key=pinecone_api_key, host=pinecone_host)
        _index = pinecone.Index(pinecone_index_name)
        _pinecone_initialized = True
    return _index

# --- Embedding ---
def embed_text(text):
    """
    Embed text using Hugging Face Inference API (BAAI/bge-base-en-v1.5).
    Returns embedding vector (list of floats).
    """
    hf_api_token = settings.HF_API_TOKEN
    embedding_model = "BAAI/bge-base-en-v1.5"
    url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{embedding_model}"
    headers = {"Authorization": f"Bearer {hf_api_token}"}
    try:
        response = requests.post(url, headers=headers, json={"inputs": text}, timeout=20)
        response.raise_for_status()
        embedding = response.json()[0]  # [0] if batch size 1
        return embedding
    except requests.exceptions.RequestException as e:
        logging.error(f"[embed_text] Hugging Face API error: {e}")
        raise RuntimeError(f"Failed to embed text: {e}")
    except Exception as e:
        logging.error(f"[embed_text] Unexpected error: {e}")
        raise

# --- Pinecone Retrieval ---
def query_pinecone(embedding, top_k=3):
    """
    Query Pinecone with embedding, return top_k relevant code/doc chunks.
    """
    try:
        index = get_pinecone_index()
        query_response = index.query(vector=embedding, top_k=top_k, include_metadata=True)
        results = []
        for match in query_response.get('matches', []):
            text = match['metadata'].get('text', '')
            metadata = match['metadata']
            results.append({"text": text, "metadata": metadata})
        return results
    except Exception as e:
        logging.error(f"[query_pinecone] Pinecone query error: {e}")
        raise RuntimeError(f"Failed to query Pinecone: {e}")

# --- Prompt Augmentation ---
def build_augmented_prompt(conversation_history, retrieved_chunks, user_input):
    """
    Build the prompt for the LLM: includes retrieved context and recent conversation.
    """
    context = "\n\n".join(chunk["text"] for chunk in retrieved_chunks)
    history = "\n".join(f"{msg['role']}: {msg['content']}" for msg in conversation_history)
    prompt = f"Relevant context:\n{context}\n\nConversation:\n{history}\nUser: {user_input}\nAssistant:"
    return prompt

# --- LLM Inference ---
def call_codegen_llm(prompt):
    """
    Call the codegen LLM (e.g., Mistral) via Hugging Face Inference API.
    """
    hf_model_id = "mistralai/Mistral-7B-Instruct-v0.3"
    hf_api_token = settings.HF_API_TOKEN
    inference_client = InferenceClient(model=hf_model_id, token=hf_api_token)
    messages = [{"role": "user", "content": prompt}]
    generation_parameters = {
        "max_tokens": 400,
        "temperature": 0.3,
        "top_p": 0.5,
    }
    chat_completion_response = inference_client.chat_completion(
        messages=messages,
        **generation_parameters
    )
    generated_code = chat_completion_response.choices[0].message.content if chat_completion_response.choices else "No response generated."
    return generated_code

def count_tokens(text, model_name="mistralai/Mistral-7B-Instruct-v0.3"):
    """
    Count the number of tokens in a text string using the specified model's tokenizer.
    """
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        tokens = tokenizer.encode(text, add_special_tokens=False)
        return len(tokens)
    except Exception as e:
        logging.error(f"[count_tokens] Token counting error: {e}")
        return -1
