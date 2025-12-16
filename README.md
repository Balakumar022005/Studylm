📄 StudyLM - AI Document Assistant

StudyLM is an AI-powered document assistant that allows users to upload documents, ask questions, and get answers instantly. The system uses a local LLM model (like TinyLLaMA/Gemini) with vector embeddings for dynamic document understanding.

This project is built with:

Frontend: React

Backend: Node.js + Express

AI Engine: LLM (local GPT4All/TinyLLaMA model) with FAISS vector database for document retrieval

File processing: PDF, DOCX, TXT

📁 Project Structure
StudyLM/
│
├─ backend/                  # Node.js backend server
│   ├─ routes/               # API endpoints (upload, QA, summarize)
│   ├─ services/             # File readers, chunkers, QA engine
│   ├─ uploads/              # Uploaded documents storage
│   ├─ faiss_index.idx       # FAISS vector DB (generated dynamically)
│   └─ server.js             # Express server entry
│
├─ document-assistant-frontend/   # React frontend
│   ├─ components/           # UploadForm, QuestionForm, AnswerDisplay
│   └─ src/
│
├─ webapp/                   # Optional React webapp folder
│
├─ convert_to_txt.py         # Utility to convert files to TXT
├─ embedding_faiss.py        # Embedding script (if needed)
├─ rag_llm_bin.py            # Script to run/train/query local LLM
├─ README.md                 # This file
└─ package.json / package-lock.json


⚠️ Note: The model file itself is not included due to size constraints. You can download it automatically via the provided script or manually.

🔧 Prerequisites

Node.js & npm

Install: https://nodejs.org/

Python 3.10+

Install: https://www.python.org/downloads/

Git

Install: https://git-scm.com/downloads

Local LLM model (TinyLLaMA / GPT4All / Gemini)

Will be downloaded automatically using the script.

⚡ Setup Instructions
1. Clone the repo
git clone git@github.com:Balakumar022005/Studylm.git
cd Studylm

2. Setup backend
cd backend
npm install

2a. Download model
# Python script to download the LLM model
python ../download_model.py


The model will be stored in backend/models/ and automatically loaded by rag_llm_bin.py.

3. Start backend server
node server.js


Server runs at http://localhost:5000

APIs available:

POST /upload → Upload a document

POST /ask → Ask a question from uploaded docs

POST /summarize → Summarize a document

4. Setup frontend
cd ../document-assistant-frontend
npm install
npm start


Frontend runs at http://localhost:3000

Features: Upload document → Ask question → Get AI answer → Export Q&A history as PDF

📝 How it Works

Upload a document → Backend converts it to text, chunks it, and stores embeddings in FAISS.

Ask a question → Backend retrieves relevant chunks and queries the local LLM.

Receive answer → Frontend displays the AI-generated answer.

History & Export → Users can copy history or export as PDF.

📌 Features

✅ Upload PDF, DOCX, TXT documents

✅ Dynamic embeddings for any document

✅ Ask questions instantly

✅ View Q&A history

✅ Copy/export history as PDF

✅ Lightweight (model downloaded separately)

💡 Tips for Beginners

Check dependencies: Make sure Node.js and Python are installed correctly.

Model setup: If the model download fails, check your internet connection and model URL.

Backend first: Always start the backend before using the frontend.

Port conflicts: Ensure ports 3000 (frontend) and 5000 (backend) are free.

File uploads: Only supported formats are PDF, DOCX, TXT.

![WhatsApp Image 2025-12-16 at 12 13 28_e071d778](https://github.com/user-attachments/assets/866b85e5-f229-4404-9236-7314e378df7b)

![22](https://github.com/user-attachments/assets/c6340a6b-2b2d-4412-abf3-b0c3e8f30aa4)
![33](https://github.com/user-attachments/assets/27e24d6d-6b1a-44cf-9a6d-22a25d4e6e4c)
