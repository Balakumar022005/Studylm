from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os

# 1️⃣ Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# 2️⃣ Load document chunks
if not os.path.exists("chunks.json"):
    raise FileNotFoundError("chunks.json not found! Please create it with your text chunks.")

with open("chunks.json", "r") as f:
    chunks = json.load(f)

# 3️⃣ Generate embeddings
embeddings = model.encode(chunks, convert_to_numpy=True)

# 4️⃣ Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# 5️⃣ Save FAISS index
faiss.write_index(index, "faiss_index.idx")
print(f"✅ FAISS index created with {index.ntotal} vectors and saved as 'faiss_index.idx'.")
