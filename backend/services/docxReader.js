import fs from "fs";
import mammoth from "mammoth";

export async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value; // Returns plain text from DOCX
  } catch (err) {
    console.error("Error reading DOCX:", err);
    return "";
  }
}
