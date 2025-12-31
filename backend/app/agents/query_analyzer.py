from typing import Dict, List
from datetime import datetime
from app.models import QueryType, AgentLog
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from app.config import settings

class QueryAnalyzerAgent:
    """Agent responsible for analyzing query intent and type"""
    
    def __init__(self):
        self.name = "Query Analyzer"
        self.llm = ChatOpenAI(
            model=settings.llm_model,
            temperature=0,
            openai_api_key=settings.openai_api_key
        )
    
    async def analyze_query(self, query: str) -> tuple[Dict[str, str], List[AgentLog]]:
        """Analyze query type and complexity"""
        logs = []
        
        logs.append(AgentLog(
            agent=self.name,
            action="Analyzing question intent",
            status="active",
            timestamp=datetime.now()
        ))
        
        # Determine query type using keywords
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['table', 'data', 'statistics', 'numbers']):
            query_type = QueryType.TABLE_BASED
            complexity = "medium"
        elif any(word in query_lower for word in ['compare', 'difference', 'versus', 'vs']):
            query_type = QueryType.COMPARISON
            complexity = "high"
        elif any(word in query_lower for word in ['image', 'diagram', 'figure', 'chart']):
            query_type = QueryType.VISUAL
            complexity = "medium"
        elif any(word in query_lower for word in ['explain', 'how', 'why', 'analyze']):
            query_type = QueryType.ANALYTICAL
            complexity = "high"
        else:
            query_type = QueryType.FACTUAL
            complexity = "low"
        
        result = {
            'type': query_type.value,
            'complexity': complexity,
            'requires_multi_hop': complexity == "high"
        }
        
        logs.append(AgentLog(
            agent=self.name,
            action="Query classification complete",
            details=f"Type: {query_type.value}, Complexity: {complexity}",
            status="completed",
            timestamp=datetime.now()
        ))
        
        return result, logs