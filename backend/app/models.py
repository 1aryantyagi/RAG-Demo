from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class QueryType(str, Enum):
    FACTUAL = "factual"
    ANALYTICAL = "analytical"
    COMPARISON = "comparison"
    TABLE_BASED = "table-based"
    VISUAL = "visual"

class DocumentUploadResponse(BaseModel):
    doc_id: str
    filename: str
    pages: int
    chunks: int
    tables: int
    images: int
    status: str
    message: str

class QueryRequest(BaseModel):
    doc_id: str
    query: str

class Source(BaseModel):
    page: int
    type: str
    content: str
    relevance: float

class AgentLog(BaseModel):
    agent: str
    action: str
    details: Optional[str] = None
    status: str
    timestamp: datetime

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]
    confidence: float
    agent_logs: List[AgentLog]
    query_type: str
    retrieval_strategy: str

class DocumentInfo(BaseModel):
    doc_id: str
    filename: str
    pages: int
    chunks: int
    tables: int
    images: int
    upload_time: datetime