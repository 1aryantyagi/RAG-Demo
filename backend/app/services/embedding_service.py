from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from typing import List
from langchain_core.documents import Document
from app.config import settings
import os

class EmbeddingService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            model=settings.embedding_model,
            openai_api_key=settings.openai_api_key
        )
        os.makedirs(settings.vector_store_dir, exist_ok=True)
    
    async def create_vector_store(self, doc_id: str, chunks: List[Document]):
        """Create vector store from document chunks"""
        persist_directory = os.path.join(settings.vector_store_dir, doc_id)
        
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=persist_directory,
            collection_name=doc_id
        )
        
        return vectorstore
    
    async def get_vector_store(self, doc_id: str):
        """Load existing vector store"""
        persist_directory = os.path.join(settings.vector_store_dir, doc_id)
        
        if not os.path.exists(persist_directory):
            raise ValueError(f"Vector store not found for doc_id: {doc_id}")
        
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embeddings,
            collection_name=doc_id
        )
        
        return vectorstore