import { extractTextFromPDF } from "./services/pdfReader.js";
import { chunkText } from "./services/textChunker.js";
import path from "path";
import { fileURLToPath } from "url";

// Needed in ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, "test", "data", "05-versions-space.pdf");

const pdfText = await extractTextFromPDF(pdfPath);

if (!pdfText.trim()) {
  console.log("⚠️ No text extracted from PDF.");
  process.exit(1);
}

const chunks = chunkText(pdfText, 50); // 50 words per chunk
console.log("✅ Total chunks:", chunks.length);
chunks.forEach((chunk, index) => {
  console.log(`\n--- Chunk ${index + 1} ---\n${chunk}`);
});
