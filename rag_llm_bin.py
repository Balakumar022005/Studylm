# rag_llm_bin.py
import os
import sys
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from gpt4all import GPT4All

# -------------------------------
# Config
# -------------------------------
BASE_DIR = os.path.dirname(__file__)
CHUNKS_FILE = os.path.join(BASE_DIR, "chunks.json")
FAISS_INDEX_FILE = os.path.join(BASE_DIR, "faiss.index")
MODEL_PATH = os.path.join(BASE_DIR, "models")
MODEL_NAME = "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

# -------------------------------
# Embedding model
# -------------------------------
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# -------------------------------
# Chunk helper
# -------------------------------
def chunk_text(text, size=100, overlap=20):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        chunks.append(" ".join(words[start:start + size]))
        start += size - overlap
    return chunks

# -------------------------------
# Save / Load FAISS index
# -------------------------------
def save_faiss(vectors):
    dim = vectors.shape[1]
    index = faiss.read_index(FAISS_INDEX_FILE) if os.path.exists(FAISS_INDEX_FILE) else faiss.IndexFlatL2(dim)
    if index.d != dim:
        index = faiss.IndexFlatL2(dim)
    index.add(vectors)
    faiss.write_index(index, FAISS_INDEX_FILE)

def load_faiss():
    if not os.path.exists(FAISS_INDEX_FILE):
        return None
    return faiss.read_index(FAISS_INDEX_FILE)

# -------------------------------
# Add new document
# -------------------------------
def add_document(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} not found")

    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        raise ValueError("Only .txt supported directly (PDF/DOCX handled by Node or separate tool).")

    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("No content extracted from file.")

    # Update chunks.json
    existing = []
    if os.path.exists(CHUNKS_FILE):
        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            existing = json.load(f)
    all_chunks = existing + chunks
    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    # Encode new chunks and update FAISS
    new_vectors = embed_model.encode(chunks, convert_to_numpy=True).astype("float32")
    save_faiss(new_vectors)

    return {"chunksAdded": len(chunks), "totalChunks": len(all_chunks)}

# -------------------------------
# Retrieve chunks for QA
# -------------------------------
def retrieve_chunks(query, top_k=3, similarity_threshold=0.4):
    if not os.path.exists(CHUNKS_FILE) or not os.path.exists(FAISS_INDEX_FILE):
        return []

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    index = load_faiss()
    if index is None or index.ntotal == 0:
        return []

    query_vec = embed_model.encode([query], convert_to_numpy=True).astype("float32")
    D, I = index.search(query_vec, min(top_k, index.ntotal))

    retrieved = []
    for idx, dist in zip(I[0], D[0]):
        if idx < len(chunks):
            retrieved.append(chunks[idx])
    return retrieved

# -------------------------------
# Answer question
# -------------------------------
def answer_question(query):
    retrieved_chunks = retrieve_chunks(query)
    if not retrieved_chunks:
        return "I’m Neha, your learning assistant. I don’t find this in your resources."

    context = "\n".join(retrieved_chunks)

    system_prompt = f"""
You are Neha, a wise and intellectual learning assistant.
Rules:
- Always begin with: "I’m Neha, your learning assistant."
- Only use the provided context. Never use outside knowledge.
- If answer is not in context, reply exactly: "I don’t find this in your resources."
- Do not hallucinate.

Context:
{context}

User Question: {query}

Answer:
"""

    full_model_file = os.path.join(MODEL_PATH, MODEL_NAME)
    if not os.path.exists(full_model_file):
        return f"Model not found at {full_model_file}"

    llm_model = GPT4All(model_name=MODEL_NAME, model_path=MODEL_PATH, allow_download=False)
    response = llm_model.generate(system_prompt, max_tokens=300, temp=0.7).strip()
    if not response:
        response = "I’m Neha, your learning assistant. I don’t find this in your resources."
    return response

# -------------------------------
# Main CLI
# -------------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)

    command = sys.argv[1].lower()

    if command == "add":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "No file path provided"}))
            sys.exit(1)
        file_path = sys.argv[2]
        try:
            result = add_document(file_path)
            print(json.dumps({"status": "success", **result}))
        except Exception as e:
            print(json.dumps({"status": "error", "error": str(e)}))
            sys.exit(1)

    elif command == "query":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "No question provided"}))
            sys.exit(1)
        question = sys.argv[2]
        try:
            answer = answer_question(question)
            print(json.dumps({"answer": answer}))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)

    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))
        sys.exit(1)
