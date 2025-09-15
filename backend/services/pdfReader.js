// services/pdfReader.js
import fs from "fs";
import pdf from "pdf-parse";

export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath); // ✅ always read file as buffer
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("❌ Error reading PDF:", error.message);
    return "";
  }
}
