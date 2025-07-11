# portfolio_project/portfolio_app/rag_pipeline.py
"""
RAG pipeline logic for code generation assistant.
Handles embedding, Pinecone retrieval, prompt augmentation, and LLM inference.
"""
import requests
from django.conf import settings
import logging
import re
from pysafebrowsing  import SafeBrowsing
from bs4 import BeautifulSoup

# You may need to install pinecone-client and huggingface_hub if not already present
import pinecone
from huggingface_hub import InferenceClient
from transformers import AutoTokenizer

pinecone_api_key = settings.PINECONE_API_KEY
pinecone_index_name = getattr(settings, 'PINECONE_INDEX', 'codegen-demo')  # Default index name if not set

# Initialize Pinecone client (singleton pattern)
_pinecone_initialized = False
_index = None

def get_pinecone_index():
    global _pinecone_initialized, _index
    pc = pinecone.Pinecone(api_key=pinecone_api_key)
    indexes = [idx['name'] for idx in pc.list_indexes()]
    if not _pinecone_initialized:
        # Use new Pinecone class API
        pc = pinecone.Pinecone(api_key=pinecone_api_key)
        # Check if index exists and is healthy
        indexes = [idx['name'] for idx in pc.list_indexes()]
        if pinecone_index_name not in indexes:
            raise RuntimeError(f"Pinecone index '{pinecone_index_name}' does not exist. Available: {indexes}")
        _index = pc.Index(pinecone_index_name)
        # Optionally, check index status/health
        try:
            _index.describe_index_stats()
        except Exception as e:
            raise RuntimeError(f"Could not connect to Pinecone index '{pinecone_index_name}': {e}")
        _pinecone_initialized = True
    return _index

# --- Embedding ---
def embed_text(text):
    """
    Embed text using Hugging Face InferenceClient feature_extraction.
    Returns embedding vector (list of floats).
    """
    hf_api_token = settings.HF_API_TOKEN
    # Use a 768-dim model for Pinecone index compatibility
    embedding_model = "sentence-transformers/all-mpnet-base-v2"
    client = InferenceClient(token=hf_api_token)
    try:
        embedding = client.feature_extraction(
            text,
            model=embedding_model,
        )
        emb = embedding[0] if isinstance(embedding, list) and len(embedding) > 0 else embedding
        if hasattr(emb, 'tolist'):
            emb = emb.tolist()
        return emb
    except Exception as e:
        logging.error(f"[embed_text] Hugging Face InferenceClient error: {e}")
        raise RuntimeError(f"Failed to embed text: {e}")

# --- Pinecone Retrieval ---
def query_pinecone(embedding, top_k=3):
    """
    Query Pinecone with embedding, return top_k relevant code/doc chunks.
    """
    try:
        index = get_pinecone_index()
        namespace = ""
        query_response = index.query(vector=embedding, top_k=top_k, include_metadata=True, namespace=namespace)
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
    # Aggressive system instruction
    system_instruction = (
        "You are a helpful AI coding assistant. You must ONLY answer using the information in the CONTEXT section below. "
        "If the CONTEXT is empty or says '[No relevant context found]', you MUST NOT answer the question, and you MUST NOT attempt to answer, elaborate, or provide any information. "
        "In that case, reply with ONLY this exact phrase and nothing else: 'I cannot answer with the provided information. Please add more context.'\n"
        "If a user is greeting you and provides no context, you may respond with a friendly greeting and ask for more details, but do NOT answer any other question.\n"
        "Do NOT use Markdown headings (lines starting with #, ##, etc.) in your response."
    )
    context = "\n\n".join(chunk["text"] for chunk in retrieved_chunks)
    if not context.strip():
        context = "[No relevant context found]"
    # Add clear delimiters to the context section
    context_block = f"====CONTEXT====\n{context}\n=============="
    print("\n[DEBUG] ===== Conversation History Start =====")
    for i, msg in enumerate(conversation_history):
        print(f"[DEBUG] [{i}] {msg['role']}: {msg['content']}")
    print("[DEBUG] ===== Conversation History End =====\n")
    print(f"[DEBUG] User input: {user_input}")
    # Only include user messages in conversation history to avoid LLM talking to itself
    user_history = [msg for msg in conversation_history if msg['role'] == 'user']
    if user_history:
        history = "\n".join(f"User: {msg['content']}" for msg in user_history)
    else:
        history = "[No prior user conversation]"
    prompt = (
        f"{system_instruction}\n"
        f"{context_block}\n\n"
        f"Conversation:\n{history}\n"
        f"User: {user_input}\nAssistant:"
    )
    print("[DEBUG] LLM Prompt:\n" + prompt)
    return prompt

# --- LLM Inference ---
def call_codegen_llm(prompt):
    """
    Call the codegen LLM (e.g., Mistral) via Hugging Face Inference API.
    """
    hf_model_id = "mistralai/Mistral-7B-Instruct-v0.3"
    hf_api_token = settings.HF_API_TOKEN
    inference_client = InferenceClient(model=hf_model_id, token=hf_api_token)
    # Split the prompt into system and user parts for the chat API
    # The system instruction is everything before the first '====CONTEXT===='
    # The user message is everything from 'User:' to 'Assistant:'
    system_content = prompt.split('====CONTEXT====')[0].strip()
    # Include the context block in the system message for maximum clarity
    context_block = prompt.split('====CONTEXT====', 1)[-1].rsplit('Conversation:', 1)[0].strip() if '====CONTEXT====' in prompt and 'Conversation:' in prompt else ''
    system_message = system_content + '\n====CONTEXT====' + context_block
    # Extract the user message
    user_content = prompt.split('User:', 1)[-1].split('Assistant:', 1)[0].strip()
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_content}
    ]
    generation_parameters = {
        "max_tokens": 400,
        "temperature": 0.7,
        "top_p": 0.9,
    }
    print("These are the messages being sent to the LLM:", messages)
    chat_completion_response = inference_client.chat_completion(
        messages=messages,
        **generation_parameters
    )
    generated_code = chat_completion_response.choices[0].message.content if chat_completion_response.choices else "No response generated."
    # Aggressive post-processing: remove leading Markdown headings (e.g., lines starting with #, ##, etc.)
    import re
    lines = generated_code.splitlines()
    # Remove all leading lines that are only Markdown headings
    while lines and re.match(r'^\s*#+\s', lines[0]):
        lines.pop(0)
    # Optionally, also remove empty lines at the start
    while lines and not lines[0].strip():
        lines.pop(0)
    generated_code = '\n'.join(lines)
    print(f"[DEBUG] Generated code: {generated_code}")
    return generated_code

def count_tokens(text, model_name="mistralai/Mistral-7B-Instruct-v0.3"):
    """
    Count the number of tokens in a text string using the specified model's tokenizer.
    Passes Hugging Face API token if available for gated models.
    """
    try:
        hf_api_token = getattr(settings, 'HF_API_TOKEN', None)
        if hf_api_token:
            tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_api_token)
        else:
            tokenizer = AutoTokenizer.from_pretrained(model_name)
        tokens = tokenizer.encode(text, add_special_tokens=False)
        return len(tokens)
    except Exception as e:
        logging.error(f"[count_tokens] Token counting error: {e}")
        return -1

def trim_conversation_history_to_fit_tokens(conversation_history, retrieved_chunks, user_input, max_tokens=8192, model_name="mistralai/Mistral-7B-Instruct-v0.3"):
    """
    Trims the conversation history so that the full prompt fits within max_tokens.
    Removes oldest messages first.
    """
    trimmed_history = conversation_history[:]
    while True:
        prompt = build_augmented_prompt(trimmed_history, retrieved_chunks, user_input)
        num_tokens = count_tokens(prompt, model_name=model_name)
        if num_tokens <= max_tokens or not trimmed_history:
            break
        trimmed_history = trimmed_history[1:]  # Remove oldest message
    return trimmed_history

# --- Summarization ---
def summarize_text_with_pegasus(text, min_length=20, max_length=60):
    system_instruction += "Do NOT use Markdown headings (lines starting with #, ##, etc.) in your response."
    """
    Summarize text using the Pegasus-XSum model via Hugging Face Inference API.
    Returns the summary string.
    """
    hf_api_token = settings.HF_API_TOKEN
    summarization_model = "google/pegasus-xsum"
    url = f"https://api-inference.huggingface.co/models/{summarization_model}"
    headers = {"Authorization": f"Bearer {hf_api_token}"}
    payload = {
        "inputs": text,
        "parameters": {"min_length": min_length, "max_length": max_length},
        "options": {"wait_for_model": True}
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        print(f"[DEBUG] Pegasus summarization raw output: {result}")
        if isinstance(result, list) and len(result) > 0 and 'summary_text' in result[0]:
            return result[0]['summary_text']
        else:
            logging.warning(f"[summarize_text_with_pegasus] Unexpected response: {result}")
            return "[Summary unavailable]"
    except Exception as e:
        logging.error(f"[summarize_text_with_pegasus] Summarization error: {e}")
        return "[Summary error]"

def extract_urls(text):
    """
    Extract all HTTP/HTTPS URLs from a string.
    """
    return re.findall(r'https?://[^\s]+', text)


# Use the Google Safe Browsing API key from Django settings
safe_browsing_api_key = getattr(settings, 'GOOGLE_SAFE_BROWSING_API_KEY', None)


def is_url_safe(url, api_key=None):
    """
    Check if a URL is safe using Google Safe Browsing API (pysafebrowsing).
    Returns True if safe, False if malicious/suspicious.
    """
    if api_key is None:
        api_key = safe_browsing_api_key
    try:
        s = SafeBrowsing(api_key)
        # pysafebrowsing expects a list of URLs (as str)
        result = s.lookup_urls([url])
        # result[url] is a dict, 'malicious' is True if unsafe
        return not result.get(url, {}).get('malicious', True)
    except Exception as e:
        logging.error(f"[is_url_safe] Error checking URL: {e}")
        return False  # Be safe by default



def fetch_and_clean_url_content(url, api_key=None, timeout=10):
    """
    Check URL safety, fetch the page, and extract visible text.
    Returns cleaned text or None if unsafe/error.
    """
    if api_key is None:
        api_key = safe_browsing_api_key
    if not url.startswith('http'):
        return None
    # Check URL safety using pysafebrowsing
    if not is_url_safe(url, api_key):
        logging.warning(f"[fetch_and_clean_url_content] Unsafe URL blocked: {url}")
        return None
    try:
        resp = requests.get(url, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'lxml')
        for tag in soup(['script', 'style']):
            tag.decompose()
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception as e:
        logging.error(f"[fetch_and_clean_url_content] Error fetching/parsing URL: {e}")
        return None
