from typing import List, Dict, Any
from langchain_core.documents import Document

class VectorStoreService:
    def __init__(self):
        self.stores = {}
    
    def add_store(self, doc_id: str, vectorstore):
        """Add vector store to memory"""
        self.stores[doc_id] = vectorstore
    
    def get_store(self, doc_id: str):
        """Get vector store from memory"""
        return self.stores.get(doc_id)
    
    async def search(self, doc_id: str, query: str, k: int = 5) -> List[Document]:
        """Search vector store"""
        store = self.get_store(doc_id)
        if not store:
            raise ValueError(f"Vector store not found for doc_id: {doc_id}")
        
        results = store.similarity_search_with_score(query, k=k)
        return results