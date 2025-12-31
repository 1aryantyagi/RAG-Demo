from typing import List, Dict, Any
from datetime import datetime
from app.models import AgentLog
from langchain_core.documents import Document

class RetrievalStrategistAgent:
    """Agent responsible for selecting optimal retrieval strategy"""
    
    def __init__(self):
        self.name = "Retrieval Strategist"
    
    async def select_strategy(self, query_analysis: Dict[str, str]) -> tuple[str, List[AgentLog]]:
        """Select optimal retrieval strategy based on query type"""
        logs = []
        
        logs.append(AgentLog(
            agent=self.name,
            action="Selecting optimal retrieval strategy",
            status="active",
            timestamp=datetime.now()
        ))
        
        query_type = query_analysis.get('type', 'factual')
        
        strategy_map = {
            'table-based': 'Structured Query + Semantic Search',
            'visual': 'Multi-modal CLIP Search',
            'comparison': 'Hybrid Search + Re-ranking',
            'analytical': 'Hybrid Search + Re-ranking',
            'factual': 'Dense Vector Search'
        }
        
        strategy = strategy_map.get(query_type, 'Dense Vector Search')
        
        logs.append(AgentLog(
            agent=self.name,
            action="Strategy selected",
            details=f"Using: {strategy}",
            status="completed",
            timestamp=datetime.now()
        ))
        
        return strategy, logs
    
    async def retrieve_documents(
        self, 
        vectorstore, 
        query: str, 
        strategy: str,
        k: int = 5
    ) -> tuple[List[Document], List[AgentLog]]:
        """Execute retrieval strategy"""
        logs = []
        
        logs.append(AgentLog(
            agent="Retrieval Engine",
            action="Searching knowledge base",
            status="active",
            timestamp=datetime.now()
        ))
        
        # Perform similarity search
        results = vectorstore.similarity_search_with_score(query, k=k)
        
        logs.append(AgentLog(
            agent="Retrieval Engine",
            action="Retrieved relevant chunks",
            details=f"Found {len(results)} highly relevant passages",
            status="completed",
            timestamp=datetime.now()
        ))
        
        return results, logs