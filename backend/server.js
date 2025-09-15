import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ Upload folder ------------------
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
const upload = multer({ dest: UPLOAD_DIR });

// ------------------ Chat History ------------------
const chatHistory = []; // stores { question, answer }

// ------------------ Upload + Index ------------------
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let text = "";

    // ------------------ Parse file content ------------------
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === ".txt") {
      text = fs.readFileSync(filePath, "utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    if (!text.trim()) return res.status(400).json({ error: "File is empty" });

    // ------------------ Save temporary TXT ------------------
    const tempTxtPath = path.join(UPLOAD_DIR, `${Date.now()}.txt`);
    fs.writeFileSync(tempTxtPath, text, "utf-8");

    // ------------------ Call Python to index ------------------
    const py = spawn("python", ["D:/new123/rag_llm_bin.py", "add", tempTxtPath]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => (errorOutput += data.toString()));

    py.on("close", (code) => {
      if (fs.existsSync(tempTxtPath)) fs.unlinkSync(tempTxtPath);

      if (code !== 0) {
        console.error("Python error:", errorOutput);
        return res.status(500).json({ error: "Indexing failed", details: errorOutput });
      }

      try {
        const result = JSON.parse(output.replace(/[\r\n]+/g, ""));
        res.json({
          message: "✅ File uploaded and indexed dynamically!",
          addedChunks: result.chunksAdded,
          totalChunks: result.totalChunks,
        });
      } catch (e) {
        console.error("JSON parse failed:", e, "Python output:", output);
        res.json({ message: "✅ File uploaded, but indexing output could not be parsed." });
      }
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process file", details: err.message });
  }
});

// ------------------ Ask Question ------------------
app.post("/ask", (req, res) => {
  const question = req.body.question;
  if (!question) return res.status(400).json({ error: "No question provided" });

  const py = spawn("python", ["D:/new123/rag_llm_bin.py", "query", question]);

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => (output += data.toString()));
  py.stderr.on("data", (data) => (errorOutput += data.toString()));

  py.on("close", (code) => {
    let answer = "";

    if (code === 0 && output) {
      try {
        const parsed = JSON.parse(output.replace(/[\r\n]+/g, ""));
        answer = parsed.answer || "";
      } catch {
        answer = output.trim();
      }
    } else {
      console.error("Python query error:", errorOutput);
      answer = "I’m Neha, your learning assistant. I couldn’t find this in your resources.";
    }

    // ------------------ Store Q&A in history ------------------
    chatHistory.push({ question, answer });

    res.json({ question, answer, history: chatHistory });
  });
});

// ------------------ Download full chat history ------------------
app.get("/download", (req, res) => {
  if (!chatHistory.length) return res.status(400).send("No chat history found.");

  // Format full history cleanly
  const content = chatHistory
    .map((item, i) => {
      // Remove any leading/trailing newlines and system prompt text from answer
      const answer = item.answer.replace(/User Question:.*/s, "").trim();
      return `Q${i + 1}: ${item.question}\nA${i + 1}: ${answer}\n`;
    })
    .join("\n");

  const fileName = "chat_history.txt";
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "text/plain");
  res.send(content);
});


// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
