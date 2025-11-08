import os
import sys
from pypdf import PdfReader

if sys.argv > 1: 
    fileName = sys.argv[1]
else:
    exit(0)

def extractTextFromPDF(file_path):
    reader = PdfReader(file_path)
    text = [(page.extract_text() + "\n") for page in reader.pages]
    return(text)

def extractTextFromTXT(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return(content)

if fileName.lower().endswith('.pdf'):
    extracted_text = extractTextFromPDF(fileName)
elif any([fileName.lower().endswith(ext) for ext in ['.txt', '.md', '.csv']]):
    extracted_text = extractTextFromTXT(fileName)
else:
    extracted_text = "Unsupported file format."
print(extracted_text)