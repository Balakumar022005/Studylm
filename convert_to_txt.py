import PyPDF2
import docx2txt
import os

def pdf_to_txt(pdf_path, txt_path):
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        text = " ".join(page.extract_text() for page in reader.pages if page.extract_text())
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Saved TXT: {txt_path}")

def docx_to_txt(docx_path, txt_path):
    text = docx2txt.process(docx_path)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Saved TXT: {txt_path}")

# Example usage
pdf_file = r"C:\Users\mskan\Downloads\Policy and FAQ Document.pdf"
txt_file = r"C:\Users\mskan\Downloads\Policy and FAQ Document.txt"
pdf_to_txt(pdf_file, txt_file)
