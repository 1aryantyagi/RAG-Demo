import os
from typing import List, Dict, Any
import pypdf
import pdfplumber
from docx import Document as DocxDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from app.config import settings

class DocumentService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    
    async def parse_document(self, filepath: str, doc_id: str) -> Dict[str, Any]:
        """Parse document and extract metadata"""
        file_ext = os.path.splitext(filepath)[1].lower()
        
        if file_ext == '.pdf':
            return await self._parse_pdf(filepath, doc_id)
        elif file_ext in ['.docx', '.doc']:
            return await self._parse_docx(filepath, doc_id)
        elif file_ext == '.txt':
            return await self._parse_txt(filepath, doc_id)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
    
    async def _parse_pdf(self, filepath: str, doc_id: str) -> Dict[str, Any]:
        """Parse PDF with layout awareness"""
        # Load and split document
        loader = PyPDFLoader(filepath)
        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        
        # Extract tables using pdfplumber
        tables = []
        with pdfplumber.open(filepath) as pdf:
            for page_num, page in enumerate(pdf.pages):
                page_tables = page.extract_tables()
                if page_tables:
                    tables.extend([{
                        'page': page_num + 1,
                        'data': table
                    } for table in page_tables])
        
        # Count images (simplified)
        with open(filepath, 'rb') as f:
            pdf_reader = pypdf.PdfReader(f)
            image_count = sum(
                len([
                    obj for obj in page.images
                ]) for page in pdf_reader.pages
            )
        
        return {
            'doc_id': doc_id,
            'pages': len(documents),
            'chunks': chunks,
            'tables': len(tables),
            'images': image_count,
            'table_data': tables
        }
    
    async def _parse_docx(self, filepath: str, doc_id: str) -> Dict[str, Any]:
        """Parse DOCX document"""
        loader = Docx2txtLoader(filepath)
        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        
        # Count tables in DOCX
        doc = DocxDocument(filepath)
        table_count = len(doc.tables)
        
        return {
            'doc_id': doc_id,
            'pages': len(documents),
            'chunks': chunks,
            'tables': table_count,
            'images': 0,  # Simplified for now
            'table_data': []
        }
    
    async def _parse_txt(self, filepath: str, doc_id: str) -> Dict[str, Any]:
        """Parse text file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        chunks = self.text_splitter.create_documents([text])
        
        return {
            'doc_id': doc_id,
            'pages': 1,
            'chunks': chunks,
            'tables': 0,
            'images': 0,
            'table_data': []
        }