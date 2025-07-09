import os
import traceback
from huggingface_hub import InferenceClient
import load_dotenv

load_dotenv.load_dotenv()

# Set your Hugging Face API token here or use an environment variable
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "<YOUR_HF_API_TOKEN>")
MODEL_ID = "codellama/CodeLlama-13b-Python-hf"

PROMPT = "Write a Python function that reverses a string."

def main():
    print(f"Testing Hugging Face Inference API with model: {MODEL_ID}")
    try:
        client = InferenceClient(model=MODEL_ID, token=HF_API_TOKEN)
        response = client.text_generation(
            prompt=PROMPT,
            max_new_tokens=200,
            temperature=0.7,
            top_p=0.9,
        )
        print("\n--- Generated Code ---\n")
        # If response is a string, just print it
        if isinstance(response, str):
            print(response.strip())
        # If response is an object with .choices[0].text, print that
        elif hasattr(response, 'choices') and response.choices:
            print(response.choices[0].text.strip())
        else:
            print(response)
    except Exception as e:
        print("\n--- Error Occurred ---\n")
        print(f"Exception type: {type(e).__name__}")
        print(f"Exception details: {e}")
        traceback.print_exc()
        # Try to print HTTP response if available
        if hasattr(e, 'response') and e.response is not None:
            print("\nHTTP Response Content:")
            print(e.response.text)

if __name__ == "__main__":
    main()
