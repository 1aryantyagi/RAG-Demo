from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import os
from datetime import datetime

from app.config import settings
from app.models import (
    DocumentUploadResponse, QueryRequest, QueryResponse,
    DocumentInfo, AgentLog
)
from app.utils.file_utils import save_upload_file, get_file_type
from app.services.document_service import DocumentService
from app.services.embedding_service import EmbeddingService
from app.services.vector_store import VectorStoreService
from app.agents.document_parser import DocumentParserAgent
from app.agents.query_analyzer import QueryAnalyzerAgent
from app.agents.retrieval_strategist import RetrievalStrategistAgent
from app.agents.response_synthesizer import ResponseSynthesizerAgent

app = FastAPI(title="Agentic RAG System API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services and agents
document_service = DocumentService()
embedding_service = EmbeddingService()
vector_store_service = VectorStoreService()

parser_agent = DocumentParserAgent()
query_agent = QueryAnalyzerAgent()
retrieval_agent = RetrievalStrategistAgent()
synthesizer_agent = ResponseSynthesizerAgent()

# In-memory document store
documents_db: Dict[str, DocumentInfo] = {}

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "agentic-rag-backend"
    }

@app.post("/api/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    try:
        # Validate file size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > settings.max_file_size:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Save file
        doc_id, filepath = await save_upload_file(file, settings.upload_dir)
        
        # Parse document with agents
        _, parse_logs = await parser_agent.analyze_structure(filepath)
        doc_data = await document_service.parse_document(filepath, doc_id)
        _, extract_logs = await parser_agent.extract_elements(doc_data)
        
        # Create embeddings and vector store
        vectorstore = await embedding_service.create_vector_store(
            doc_id, 
            doc_data['chunks']
        )
        vector_store_service.add_store(doc_id, vectorstore)
        
        # Store document info
        doc_info = DocumentInfo(
            doc_id=doc_id,
            filename=file.filename,
            pages=doc_data['pages'],
            chunks=len(doc_data['chunks']),
            tables=doc_data['tables'],
            images=doc_data['images'],
            upload_time=datetime.now()
        )
        documents_db[doc_id] = doc_info
        
        return DocumentUploadResponse(
            doc_id=doc_id,
            filename=file.filename,
            pages=doc_data['pages'],
            chunks=len(doc_data['chunks']),
            tables=doc_data['tables'],
            images=doc_data['images'],
            status="success",
            message="Document processed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query", response_model=QueryResponse)
async def query_document(request: QueryRequest):
    """Query a document using agentic RAG"""
    try:
        # Validate document exists
        if request.doc_id not in documents_db:
            raise HTTPException(status_code=404, detail="Document not found")
        
        all_logs: List[AgentLog] = []
        
        # Step 1: Analyze query
        query_analysis, analysis_logs = await query_agent.analyze_query(request.query)
        all_logs.extend(analysis_logs)
        
        # Step 2: Select retrieval strategy
        strategy, strategy_logs = await retrieval_agent.select_strategy(query_analysis)
        all_logs.extend(strategy_logs)
        
        # Step 3: Retrieve documents
        vectorstore = vector_store_service.get_store(request.doc_id)
        retrieved_docs, retrieval_logs = await retrieval_agent.retrieve_documents(
            vectorstore,
            request.query,
            strategy
        )
        all_logs.extend(retrieval_logs)
        
        # Step 4: Synthesize response
        response_data, synthesis_logs = await synthesizer_agent.synthesize_response(
            request.query,
            retrieved_docs,
            query_analysis['type']
        )
        all_logs.extend(synthesis_logs)
        
        return QueryResponse(
            answer=response_data['answer'],
            sources=response_data['sources'],
            confidence=response_data['confidence'],
            agent_logs=all_logs,
            query_type=query_analysis['type'],
            retrieval_strategy=strategy
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def list_documents():
    """List all uploaded documents"""
    return {"documents": list(documents_db.values())}

@app.get("/api/documents/{doc_id}", response_model=DocumentInfo)
async def get_document(doc_id: str):
    """Get document information"""
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    return documents_db[doc_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)